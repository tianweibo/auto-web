import OmegaLogger from "buried-points-sdk-all";
// 2、全局数据初始化
/* var id=null
if(localStorage.getItem('info')){
    if(JSON.parse(localStorage.getItem('info')).id){
        id=JSON.parse(localStorage.getItem('info')).id;
    }
} */
OmegaLogger.setConfig({
  is_prod: true,
  runtime_env: OmegaLogger.ENUM_RUNTIME_ENV.pc,
  platform_app: '埋点管理平台',
  platform_app_code: 'mdglpt',
  platform_app_version: '1.1.1',
  application_dep_platform: 'crm_enbrands',
  platform_business: 'BD',
  is_interactive: false,
  merchant_id: '未知',   //shopid
  distinct_id: '未知',   //userid
  act_id: '未知',        //'未知'
  member_id: '未知',     //'未知'
  application_label: 'common',

  nick:'未知',
  mix_nick:'未知',
  act_name:'未知',
  open_id:'未知',
  phone:'未知',
  ouid:'未知',
  provider:'未知',
  open_type:1,     //  1正常数据也就是对接新埋点平台，2互动营销类的，3其他
})
