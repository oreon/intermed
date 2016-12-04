import moment from 'moment'

Template.registerHelper( 'datef', (dt) => {
  return moment(dt).format('D MMM YY hh:mm');
});