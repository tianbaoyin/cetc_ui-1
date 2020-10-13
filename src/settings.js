module.exports = {

  title: '软件质量管控平台',

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true,

  tagsView: true,
  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,
  // 文档模板上传路径
  uploadDocTemplateUrl: 'http://127.0.0.1:9807/documentTemplate/uploadTemplate',
  downloadDocTemplateUrl: 'http://localhost:9807',
  // 文档审查文件上传地址
  documentCheckUploadUrl: 'http://127.0.0.1:82/api-project/documentcheck/uploadFile',
  // openoffic地址
  openOfficeUri: 'http://127.0.0.1:9807',

  bpmnUrl: 'http://127.0.0.1:9812',
  sysMonitorUrl: 'http://127.0.0.1:83',
  sysZipkinUrl: 'http://127.0.0.1:84'

}
