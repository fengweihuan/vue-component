<template lang="pug">
  .plan_dialog      
    .dialog_tree
      el-scrollbar(style="height:100%")
        el-tree(
          ref="authorityTree"
          :data="treeData"
          v-loading="treeLoading"
          :expand-on-click-node="false"
          :default-expanded-keys="[]"
          show-checkbox
          :accordion="true"
          highlight-current
          :props="{children: 'child',label: 'name'}"
          @current-change="currentChange"
          @check="checkHandle"
          node-key="key"
        )
          .tree_lists(slot-scope="{ node, data }" :data-id="data.id" :class="!data.selected ? 'hide' : ''")
            span.name {{data.name}}
            span.iconfont(
              :class="data.selected ? 'icon-chakanmima1' : 'icon-bukejian1'"
              @click.prevent="toggleVisible(data, $event)"
            )
    .xt-scene(ref="cesiumContainer"  @contextmenu.prevent="mousedown")
      xt-popover(
        title=""
        ref="popover"
        :popoverData="popoverDataArr"
        @clickItem="clickHandle"
      )
      .diaphaneity(v-if="layershowModel" style="top: 80px;")
        p 模型透明：
        el-slider(ref="ppp" v-model="diaphaneityModel" :format-tooltip="tooltipHandle")
      el-button(type="primary" size="small" class="buttr" v-if="booolGetsmid" @click="bindmodel" ) 关联确定
    attrib(ref="attributs" :uniqueid="currentselectUniqueid")
    el-card.calculte_wrap(v-if="hasCalculate" :body-style="{padding:'10px'}")
      .calculte_item
        .label 未计量
        .ban.calculte_wait
      .calculte_item
        .label 计量中
        .ban.calculte_doing
      .calculte_item
        .label 已完成
        .ban.calculte_finish
      .calculte_item
        .label 合同占比
        .value {{ value_percent }}
      .calculte_item
        .label 剩余计量
        .value {{ value_count + '万元' }}
    xt-editDialog(
      ref="timeEdit"
      title="时间"
      :label-width="120"
      :formList="timeFormList"
      @submit="timeSubmit"
    ) 
</template>
<script>
import PROJECTDATA from '@/server'
import request from '@/utils/request'
import { deepClone } from '@/utils' 
import dayjs from 'dayjs'
import attrib from '@/views/components/attributetab'
import { mapGetters } from 'vuex'
export default {
  name: 'xt-scene',
  components: { attrib },
  data () {
    return {
      value_percent: '',
      value_count: '',
      select:false,
      treeLoading: false,
      initKeys: [],
      layershowModel: false,
      diaphaneityModel: 100,
      currentUniqueid: [], // 当前Uniqueid
      currentselectUniqueid: '', //当前点击的某一个Uniqueid
      selectModel: {},         //选择的模型 {smid: uniqueid}
      treeData: [], // 目录树数组
      initTree: [],
      flymodel:{}, // smid模型数据
      loadLay: undefined,
      scene:undefined,
      viewer:undefined,
      handler:undefined,
      layjji: undefined,
      layerArr: [],    //图层集合
      viewport: [],
      uniqueidData: {},
      currentSelectNode: [],      // 当前选中构件的tree key
      currentSelectSmid: [],      // 当前选中构件的smid
      timeFormList: [
        {
          title: '开始时间',
          type: 'date',
          defaultValue: '',
          key: 'starttime',
          props: {
            'placeholder': '选择时间',
            'value-format': 'yyyy-MM-dd',
            'picker-options': {
              disabledDate () {
                return true
              }
            }
          }
        },
        {
          title: '结束时间',
          type: 'date',
          defaultValue: '',
          key: 'endtime',
          props: {
            'placeholder': '选择时间',
            'value-format': 'yyyy-MM-dd',
            'picker-options': {
              disabledDate () {
                return true
              }
            }
          }
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['currentProject']),
    popoverDataArr () {
      let arr = [{
        label: '清空选中',
        value: 'clear'
      }]
      if (this.currentUniqueid.length > 0) {
        arr.push({label: '属性', value: 'attr'})
      }
      if (this.popoverData && this.popoverData.length > 0) {
        return this.popoverData.concat(arr)
      } else {
        return arr
      }
    }
  },
  watch: {
    taskeUniauelds (value) {
      if (this.layjji) {
        this.setTaskColor()
      }
    },
    diaphaneityModel (value){
      this.layjji.style3D.fillForeColor.alpha = parseFloat(value / 100)
    },
  },
  props: {
    booolGetsmid: { // 是否选择
      type: Boolean,
      default: true
    },
    multiple :{ // 是否多选
      type: Boolean,
      default: true
    },
    hasCalculate: {   //包含计量
      type: Boolean,
      default: false
    },
    popoverData: {
      type: Array,
      default: undefined
    },
    taskeUniauelds: {  //任务进度 已完成的构件
      type: Array,
      default: undefined
    }
  },
  created () {
    this.getUniqueid()
    this.getData()
  },
  mounted () {
    this.init()
  },
  methods:{
    async getData () {
      this.treeLoading = true
      let res = await this.$api.getDirectoryTreeProject(1)
      let menuTree = []
      let promiseArr = res.result.menu.map(item => this.$api.getDirectoryTree(item))
      let resArr = await Promise.all(promiseArr)
      resArr.map(item => {
        menuTree.push(...item.result.main)
      })
      const model_layer = this.currentProject.model_layer || []
      let modelArr = []
      model_layer.map((item, index) => {
        if (item.type !== 'model') {
          modelArr.push({
            name: item.name,
            disabled: true,
            selected: true,
            modelIndex: index,
            type: 'other'
          })
        }
      })
      if (menuTree) {
        menuTree.map(item => {
          item.selected = true
          this.setSelect(item)
        })
        this.treeData = menuTree.concat(modelArr)
        this.initTree = deepClone(this.treeData)
      }
      this.treeLoading = false
      this.currentUniqueid.length > 0 && this.setSmid(this.currentUniqueid)
      this.$nextTick(() => {
        this.initKeys.length > 0 && this.setCheckedKeys(this.initKeys, true)
      })
    },
    async getUniqueid (arr) {
      let res = await this.$api.getDirectoryUniqueid(arr || [])
      res.result.map(item => {
        if (item.unique_id && item.unique_id.length > 1) {
          item.unique_id.map(list => {
            this.uniqueidData[list] && console.warn('存在相同的uniqueid!')
            this.uniqueidData[list] = item
          })
        } else {
          this.uniqueidData[item.unique_id] && console.warn('存在相同的uniqueid!')
          this.uniqueidData[item.unique_id] = item
        }
      })
      this.currentUniqueid.length > 0 && this.setSmid(this.currentUniqueid)
    },
    setSelect (item) {
      if (item.child && item.child.length > 0) {
        item.child.map(list => {
          list.selected = true
          this.setSelect(list)
        })
      }
    },
    async init () {
      var datasoure = await this.getdata()
      const model_layer = this.currentProject.model_layer || []
      this.viewer = new Cesium.Viewer(this.$refs.cesiumContainer, {
        fullscreenButton: false,
        selectionIndicator: false,
        infoBox: false
      })
      this.scene = this.viewer.scene
      this.getsmid()
      var url = PROJECTDATA.Realspace + '3D-' + this.currentProject.work_space + "/rest/realspace"
      var urldata = PROJECTDATA.Realspace + 'data-' + this.currentProject.work_space + "/rest/data"
      this.layerArr = await this.scene.open(url)
      let errorArr = []
      model_layer.map((item, index) => {
        if (item.type === 'model') {
          this.layjji = this.layerArr[index]
        } else {
          if (!this.layerArr[index]) {
            errorArr.push(item.name)
          }
        }
      })
      errorArr.length > 0 && this.$error(`未找到${errorArr.toString()}图层!`)
      if (!this.layjji || !this.layjji.setObjsColor) {
        this.$message.error('图层设置错误!无法进行交互')
        return false
      }
      this.layershowModel = true
      this.layjji.setQueryParameter({
        url: urldata,
        dataSourceName:datasoure[0],
        dataSetName:datasoure[1],
        keyWord: 'SmID'
      })
      
      this.layjji.selectedColor  = Cesium.Color.RED
      this.layjji.selectColorType  = 1
      this.currentUniqueid.length > 0 && this.setSmid(this.currentUniqueid)
      if (this.initKeys.length > 0) {
        this.setKeys(this.initKeys)
      }
      this.layjji.refresh()
      if (this.taskeUniauelds && this.taskeUniauelds.length > 0) {
        this.setTaskColor()
      }
      if (this.hasCalculate) {
        this.setCalculate()
      }
    },
    // 滑动条tips
    tooltipHandle (value) {
      return value + '%'
    },
    async getdata(){
      return new Promise(async (resolve, reject) => {
        var dataname, datasetname, data = []
        let layerUrl = 'data-' + this.currentProject.work_space
        let res = await this.$api.getr(layerUrl)
        dataname = res.datasourceNames[0]
        let respone = await request({
          url: `iserver!` + layerUrl + `/rest/data/datasources/`+dataname+`/datasets.rjson`, 
          method: 'get',
          headers: { iserver: true }
        })
        if (respone.datasetNames.length === 0) {
          this.$error('该服务数据集不存在!请重新发布')
          resolve([])
        }
        datasetname = respone.datasetNames[0]
        data.push(dataname,datasetname)
        resolve(data)
      })
    },
    async clickHandle (row) {
      if(row.value === 'clear') {
        this.clearfix()
      } else if(row.value === 'planTime' || row.value === 'taskTime') {
        let data = this.$refs.authorityTree.getCheckedNodes()
        let uniqueids = []
        data.map(item => {
          if (item.uniqueid && item.uniqueid.length > 0) uniqueids.push(...item.uniqueid)
        })
        if (uniqueids.length > 0) {
          let url = row.value === 'planTime' ? 'getDetailPlanComTime' : 'getTaskManageComTime'
          let res = await this.$api[url](uniqueids)
          if (res.result.length > 0) {
            let timeArr = this.computedPlanTime(res.result)
            this.timeFormList.map((item, index) => {
              item.props['picker-options'] = {
                disabledDate (time) {
                  if (timeArr[index].length === 0) {
                    return false
                  } else {
                    return dayjs(time).isBefore(dayjs(timeArr[0])) || dayjs(time).isAfter(dayjs(timeArr[1]))
                  }
                }
              }
            })
          } else {
            this.timeFormList.map(item => {
              item.props['picker-options'] = {
                disabledDate () {
                  return false
                }
              }
            })
          }
          let json = { type: row.value, starttime: '', endtime: '' }
          if (uniqueids.length === 1 && res.result.length === 1) {
            json.starttime = res.result[0].starttime
            json.endtime = res.result[0].endtime
          }
          this.$refs.timeEdit.open(json)
        } else {
          this.$message.warning('请至少选择一个构件!')
        }
      } else if (row.value === 'attr') {
        this.$refs.attributs.show()
      }
    },
    async toggleVisible(row, event){
      event.stopPropagation()
      let key = row.key
      const visible = !row.selected
      if (row.type && row.type === 'other') {
        let item = this.layerArr[row.modelIndex]
        if (item) {
          item.visible  = visible
          row.selected = visible
        } else {
          this.$error(row.name + '不存在!')
        }
        return false
      }
      row.selected = visible
      if (row.child && row.child.length > 0) {
        this.setVisible(row.child, visible)
      }
      if(!this.flymodel[key]){
        let res = await this.$api.getDirectoryTreeNode([key])
        this.flymodel[key] = {smid: res.result.SmID.map(item => item.toString()), coordinate: res.result.coordinate}
      }
      let smid = this.flymodel[key].smid || []
      let selectTree = this.$refs.authorityTree.getCheckedNodes().map(item => item.key)
      if (visible) {
        this.layjji.removeObjsColor(smid)
        if (selectTree.includes(row.key)) {
          this.layjji.setObjsColor(smid, Cesium.Color.RED)
        }
      } else {
        this.layjji.setObjsColor(smid, new Cesium.Color(205,228,253, 0))
      }
    },
    // 点击节点
    async currentChange (data) {
      console.log('点击当前树节点')
      if (data.type && data.type === 'other') {
        let item = this.layerArr[data.modelIndex]
        if (item) {
          console.log('点击了其他图层')
        } else {
          this.$error(data.name + '不存在!')
        }
        return false
      }
      return new Promise(async (reslove, reject) => {
        let key = data.key
        if(!this.flymodel[key]){
          let res = await this.$api.getDirectoryTreeNode([key])
          let smids = res.result.SmID || []
          this.flymodel[key] = {smid: smids.map(item => item.toString()), coordinate: res.result.coordinate}
          reslove()
        } else {
          reslove()
        }
        this.setViewport(this.flymodel[key].coordinate)
      })
    },
    // 选中节点
    async checkHandle (row, data) {
      this.currentSelectNode = data.checkedKeys
      const select = data.checkedKeys.includes(row.key)
      if (select) {
        this.$refs.authorityTree.setCurrentKey(row.key)
        await this.currentChange(row)
      } else {
        if(!this.flymodel[row.key]){
          let res = await this.$api.getDirectoryTreeNode([row.key])
          this.flymodel[row.key] = { smid: res.result.SmID.map(item => item.toString()), coordinate: res.result.coordinate }
        }
      }
      let smid = this.flymodel[row.key].smid || []
      if (select) {
        this.layjji.setObjsColor(smid, Cesium.Color.RED)
        this.currentSelectSmid.push(...smid)
      } else {
        this.layjji.removeObjsColor(smid)
        let arr = []
        this.currentSelectSmid.map(item => {
          if (!smid.includes(item)) {
            arr.push(item.toString())
          }
        })
        this.currentSelectSmid = arr
      }
      console.log(this.currentSelectSmid)
    },
    // 点击模型获取id
    getsmid() { 
      this.viewer.pickEvent.addEventListener((feature) => {
        if (feature) {
          // console.log(feature)
          const uniqueid = feature.UNIQUEID
          const select = this.currentSelectSmid.includes(feature.SMID)
          let smid = [feature.SMID.toString()]
          const data = this.uniqueidData[feature.UNIQUEID]
          // console.log('uniqueid为' + feature.UNIQUEID)
          // console.log('smid为' + feature.SMID)
          if (!data) {
            console.warn('找不到对应的uniqueid为' + feature.UNIQUEID)
            this.$message.warning('找不到对应的构件信息')
            return false
          }
          const smidArr = []
          data.smid.map(item => {
            smidArr.push(item.toString())
          })
          if (smidArr && smidArr.length > 1) {
            console.log('存在相同的uniqueid')
            smid = smidArr
          }
          // console.log(smidArr)
          if (!smidArr.includes(feature.SMID.toString())) {
            console.warn('uniqueid对应的smid 存在错误！')
            this.$message.warning('构件信息错误')
            return false
          }
          if (select) {
            this.layjji.removeObjsColor(smid)
            this.layjji.releaseSelection()
            smid.map(item => {
              if (this.currentSelectSmid.includes(item)) {
                let index = this.currentSelectSmid.indexOf(item)
                this.currentSelectSmid.splice(index, 1)
              }
            })
          } else {
            this.currentselectUniqueid = uniqueid
            this.layjji.setObjsColor(smid, Cesium.Color.RED)
            this.currentSelectSmid.push(...smid)
          }
          this.setTreeNode([uniqueid], !select)
        }
      })
    },
    // 单独设置目录树当前选中node
    setTreeNode (uniqueids, select) {
      let keysArr = []
      uniqueids.map(item => {
        let key = this.uniqueidData[item].key
        key && keysArr.push(key)
      })
      this.setCheckedKeys(keysArr, select)
    },
    setCheckedKeys (keys, select) {
      keys.map(item => {
        this.$refs.authorityTree.setChecked(item, select)
      })
      // const currentKeys = this.$refs.authorityTree.getCheckedKeys() || []
      // if (select) {
      //   console.log('选择新的构件')
      //   currentKeys.push(...keys)
      // } else {
      //   console.log('取消选择的构件')
      //   keys.map(item => {
      //     if (currentKeys.includes(item)) {
      //       const index = currentKeys.indexOf(item)
      //       currentKeys.splice(index, 1)
      //     }
      //   })
      // }
      // this.$refs.authorityTree.setCheckedKeys(currentKeys)
    },
    getTreeKeys (item, uniqueids) {
      let keys = []
      item.map(list => {
        if (list.uniqueid && list.uniqueid.length > 0 && uniqueids.includes(list.uniqueid)) {
          console.log(list.key)
          keys.push(list.key)
        }
        if (list.child && list.child.length > 0) {
          keys.push(...this.getTreeKeys(list.child, uniqueids))
        }
      })
      keys.length > 0 && console.log(keys)
      return keys
    },
    bindmodel(){ // 提交关联id
      let data = this.$refs.authorityTree.getCheckedNodes()
      let uniqueids = []
      data.map(item => {
        if (item.uniqueid && item.uniqueid.length > 0) uniqueids.push(...item.uniqueid)
      })
      this.$emit('submit', uniqueids)
    },
    // 设置smid 初始化
    async setSmid (uniqueid) {
      this.currentUniqueid = uniqueid || []
      if (!this.layjji || Object.keys(this.uniqueidData).length === 0 || this.treeData.length === 0) {
        console.log('未初始化')
        return false
      }
      this.clearfix()
      if (uniqueid.length > 0) {
        let res = await this.$api.getDirectoryUniqueid(uniqueid)
        let keys = []
        let smids = []
        let coordinate = res.result[0] && res.result[0].coordinate
        res.result.map((item, index) => {
          if (index !== 0 && coordinate) {
            if (item.coordinate.top - 0 > coordinate.top - 0) coordinate.top = item.coordinate.top
            if (item.coordinate.east - 0 > coordinate.east - 0) coordinate.east = item.coordinate.east
            if (item.coordinate.north - 0 > coordinate.north - 0) coordinate.north = item.coordinate.north
            if (item.coordinate.west - 0 < coordinate.west - 0) coordinate.west = item.coordinate.west
            if (item.coordinate.south - 0 < coordinate.south - 0) coordinate.south = item.coordinate.south
            if (item.coordinate.bottom - 0 < coordinate.bottom - 0) coordinate.bottom = item.coordinate.bottom
          }
          keys.push(item.key)
          item.smid.map(list => {
            if (!smids.includes(list.toString())) {
              smids.push(list.toString())
            }
          })
        })
        this.currentSelectSmid = smids
        this.currentSelectNode = keys
        this.currentselectUniqueid = uniqueid[uniqueid.length - 1]
        this.layjji.setObjsColor(smids, Cesium.Color.RED)
        this.setCheckedKeys(keys, true)
        this.setViewport(coordinate)
      }
    },
    // 设置视口
    setViewport (coordinate) {
      console.log('跳转到视口')
      console.log(coordinate)
      if (!coordinate) return false
      const { north, south, east, west, top, bottom} = coordinate || {}
      if (this.scene) {
        this.viewport = []
      } else {
        this.viewport = coordinate
        return false
      }
      var entity = new Cesium.Entity({
        id: 'fly1Tmp',
        polygon: new Cesium.PolygonGraphics({
          hierarchy:Cesium.Cartesian3.fromDegreesArrayHeights([
            east - 0, north - 0, bottom - 0,                                                           //e东 n北  东s南  w西nans   西北
            east - 0, south - 0, bottom - 0,
            west - 0, south - 0, bottom - 0,
            west - 0, north - 0, bottom - 0
          ]),
          extrudedHeight: top - 0,                                                            // 顶部高程
          perPositionHeight:true,
          closeBottom:true,
          closeTop:true,
          show : true, 
          material: Cesium.Color.RED,
        }) 
      })
      this.viewer.entities.add(entity)
      var promise=this.viewer.flyTo(entity, {duration:0}).then(() => {
        this.viewer.entities.removeById("fly1Tmp")
      })
    },
    async setCalculate () {
      this.hasCalculate = true
      let res = await this.$api.getMeterage()
      this.value_count = res.result.value_count
      this.value_percent = res.result.value_percent
      if (res.result.smid_wait.length > 0) {
        this.layjji.setObjsColor(res.result.smid_wait, Cesium.Color.ORANGE  )
      }
      if (res.result.smid_doing.length > 0) {
        this.layjji.setObjsColor(res.result.smid_doing, Cesium.Color.DEEPSKYBLUE)
      }
      if (res.result.smid_finish.length > 0) {
        this.layjji.setObjsColor(res.result.smid_finish, Cesium.Color.LIME ) 
      }
    },
    // 通过key 设置选中构建
    async setKeys (keys) {
      if (!this.layjji) {
        this.initKeys = keys
      } else {
        this.clearfix()
        let res = await this.$api.getDirectoryTreeNode(keys)
        this.layjji.setObjsColor(res.result.SmID, Cesium.Color.RED)
        this.setCheckedKeys(keys, true)
        this.setViewport(res.result.coordinate)
      }
    },
    // 批量修改时间确认
    async timeSubmit (type, row) {
      if (!row.starttime && !row.endtime) {
        this.$message({
          type: 'warning',
          message: '未修改任何时间哦！'
        })
        return false
      }
      if (dayjs(row.starttime).isAfter(dayjs(row.endtime))) {
        this.$message.warning('开始时间必须在结束时间之前!')
        return false
      }
      let data = this.$refs.authorityTree.getCheckedNodes()
      let uniqueids = []
      data.map(item => {
        if (item.uniqueid && item.uniqueid.length > 0) uniqueids.push(...item.uniqueid)
      })
      let params = {
        id: uniqueids.toString(),
        starttime: row.starttime,
        endtime: row.endtime
      }
      let url = row.type === 'planTime' ? 'editDetailPlanComTime' : 'editTaskManageComTime'
      let res = await this.$api[url](params)
      this.$success('修改成功!')
      this.$refs.timeEdit.handleClose()
    },
    // 计算多个时间的最小值
    computedPlanTime (arr) {
      let starttime = ''
      let endtime = ''
      arr.map((item, index) => {
        if (starttime.length === 0) {
          starttime = item.starttime
        } else {
          if (dayjs(item.starttime).isAfter(dayjs(starttime))) starttime = item.starttime
        }
        if (endtime.length === 0) {
          endtime = item.endtime
        } else {
          if (dayjs(item.endtime).isBefore(dayjs(endtime))) endtime = item.endtime
        }
      })
      return [starttime, endtime]
    },
    mousedown (event) {
      this.$refs.popover.show(event)
    },
    // 设置任务完成构件颜色
    async setTaskColor () {
      console.log('设置任务颜色')
      let res = await this.$api.getDirectoryUniqueid(this.taskeUniauelds)
      let smid = []
      res.result.map(item => {
        if (item.smid && item.smid.length > 0) {
          smid.push(...item.smid)
        }
      })
      try {
        this.layjji && this.layjji.setObjsColor(smid, Cesium.Color.LIME)
      } catch (error) {
        this.$error('渲染失败')
      }
    },  
    // 清空选中
    clearfix () {
      this.layjji.removeAllObjsColor()
      this.currentSelectSmid = []
      this.currentSelectNode = []
      // this.$refs.authorityTree.setCheckedKeys([], false)
      // 判断数量改变渲染方案
      const currentKeys = this.$refs.authorityTree.getCheckedKeys() || []
      if (currentKeys.length > 10000) {
        let cloneTreeData = deepClone(this.initTree)
        this.treeData= []
        this.treeData = cloneTreeData
      } else {
        currentKeys.map(item => {
          this.$refs.authorityTree.setChecked(item, false)
        })
        this.setVisible(this.treeData, true)
      }
    },
    setVisible (arr, visible) {
      arr.map(item => {
        item.selected = visible
        if (item.child && item.child.length > 0) {
          this.setVisible(item.child, visible)
        }
      })
    }
  }
}
</script>
<style lang="scss">
.plan_dialog {
  display: flex;
  padding-top: 6px;
  height: 100%;
  .diaphaneity{
    display: flex;
    color: #fff;
    align-items: center;
    margin-left: 30px;
    position: fixed;
    right: 50px;
    top: 40px;
    i{
      margin-left: 20px;
      font-size: 20px;
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
    }
    .el-slider{
      width: 200px;
      margin-left: 10px;
    }
  }
  .calculte_wrap{
    position: absolute;
    right: 40px;
    top: 90px;
    background-color: #fff;
    font-size: 13px;
    .calculte_item{
      height: 28px;
      display: flex;
      align-items: center;
      .label {
        margin-right: 10px;
      }
      .ban{
        height: 14px;
        width: 80px;
        border-radius: 4px;
      }
    }
  }
  .dialog_prj{
    cursor: pointer;
    .prj_item{
      font-size: 14px;
      height: 30px;
      line-height: 30px;
      width: 180px;
      padding-left: 6px;
      color: #606266;
      &.active, &:hover{
        background-color: #f9fafc;
        color: #409eff;
      }
    }
   
  }
   .buttr{
      position: absolute;
      right: 20px;
      bottom: 20px;
      z-index: 9999;
    }
  .dialog_tree{
    width: 360px;
    position: relative;
    & /deep/ .tree_lists{
      width: 100%;
      display: flex;
      flex:1;
      align-items: center;
      justify-content: space-between;
      &.hide{
        color: #c1c1c1;
      }
      .name{
        font-size: 14px;
        display: inline-block;
        width: 180px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .iconfont{
        font-size: 18px;
        margin-right: 20px;
        margin-left: 20px;
        position: relative;
        right: 0;
        cursor: pointer;
        &:after{
          position: absolute;
          content: "";
          left: -6px;
          top: -6px;
          bottom: -6px;
          right: -14px;
        }
      }
    }
  }
  .xt-scene{
    position: relative;
    background-color: brown;
    height: 100%;
    width: 100%;
    .cesium-widget canvas {
      width: 100%;
      height: 100%;
      -ms-touch-action: none;
      touch-action: none;
    }
  }
}
</style>

