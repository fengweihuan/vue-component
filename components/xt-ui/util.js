import { Notification } from 'element-ui'
export const notify = ({ title, msg, type = 'info' }) => {
  Notification({
    title: title,
    message: msg,
    type: type
  })
}
