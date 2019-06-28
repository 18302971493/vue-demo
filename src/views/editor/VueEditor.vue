<style lang="less">
    @import '../../styles/common.less';
    @import 'VueEditor.less';
</style>


<template>
      <div>
        <div id="editor" style="text-align:left"></div>
      </div>
</template>

<script>
  import {
    uploadFile,
  } from "../../api/sys";
  import E from 'wangeditor'
  import { Message } from 'iview';
  export default {
      name: 'editor',
      data () {
        return {
          editorContent: '',
          editor:'',
        }
      },
      props:{
        path: {
          type: String,
          required: true
        }
      },
      methods: {
        getHtml() {
          return this.editor.txt.html();
        },
        setHtml(txt) {
          this.editor.txt.html(txt);
        }
      },
      mounted () {
        this.editor = new E("#editor")
        this.editor.customConfig.menus = [
          'head',  // 标题
          'bold',  // 粗体
          'fontSize',  // 字号
          'fontName',  // 字体
          'italic',  // 斜体
          'underline',  // 下划线
          'strikeThrough',  // 删除线
          'foreColor',  // 文字颜色
          'backColor',  // 背景颜色
          'list',  // 列表
          'justify',  // 对齐方式
          'quote',  // 引用
          'emoticon',  // 表情
          'image',  // 插入图片
          'table',  // 表格
        ]
        this.editor.customConfig.fontNames = [
          '宋体',
          '微软雅黑',
          'Arial',
          'Tahoma',
          'Verdana'
        ]
        this.editor.customConfig.withCredentials = true
        this.editor.customConfig.uploadFileName = 'file';
        this.editor.customConfig.uploadImgServer=uploadFile
        this.editor.customConfig.uploadImgParams = {
          path: this.path
        }
        this.editor.customConfig.uploadImgHooks = {
          success: function (xhr, editor, result) {
            Message.success('上传成功');
          },
          fail: function (xhr, editor, result) {
            // 图片上传并返回结果，但图片插入错误时触发
            Message.error("上传成功")
          },
          error: function (xhr, editor) {
            // 图片上传出错时触发
           Message.error("服务器出现错误")
          },
          timeout: function (xhr, editor) {
            // 图片上传超时时触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
            Message.error("服务器超时")
          },

          customInsert: function (insertImg, result, editor) {
            var url = result.data
            insertImg(url)
          }
        }
        this.editor.customConfig.customAlert = function (info) {
          // info 是需要提示的内容
          Message.error(info)
        }
        this.editor.create()
      }
  };
</script>
