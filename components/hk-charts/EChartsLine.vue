<template lang="pug">
  ECharts(:options="options" v-bind="$attrs")
</template>

<script>
import ECharts from './ECharts'
import shadeBlend from './shadeBlend.js'

export default {
  components: {
    ECharts
  },
  props: {
    color: {
      type: String,
      default: '#ffffff'
    }
  },
  data () {
    return {
      options: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: this.color
            }
          }
        },
        grid: {
          top: 30,
          bottom: 40
        },
        xAxis: {
          type: 'category',
          axisTick: {
            show: false
          },
          axisLabel: {
            margin: 15,
            color: '#999'
          },
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#eee']
            }
          },
          data: []
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#999'
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#eee']
            }
          }
        },
        series: [
          {
            type: 'line',
            smooth: true,
            connectNulls: true,
            symbol: 'circle',
            symbolSize: 15,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: this.color
                  }, {
                    offset: 1,
                    color: shadeBlend(0.5, this.color)
                  }]
                },
                shadowColor: 'rgba(0, 0, 0, .1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: '#fff',
                borderColor: this.color,
                borderWidth: 5
              }
            },
            data: []
          }
        ]
      }
    }
  },
  methods: {
    drawChart (xAxisData, seriesData) {
      let options = this.options
      options.xAxis.data = xAxisData
      options.series[0].data = seriesData
    }
  }
}
</script>
