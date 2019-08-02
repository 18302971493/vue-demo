<template>
    <div>
        <div>
            <Row :gutter="5">
                <Col span="16">
                    <Alert show-icon>
                        <span class="select-count">提示:最多上传{{fileNum}}张图片,当前上传{{uploadList.length}}张</span>
                    </Alert>
                </Col>
                <Col span="6">
                    <Button type="info" v-if="uploadList.length>0" :loading="loading" @click="upload">开始上传</Button>
                </Col>
            </Row>
            <div class="demo-upload-list" v-for="(item,index) in uploadList">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                    </div>
            </div>
            <Upload
                    ref="upload"
                    :action="uploadFileUrl"
                    :headers="accessToken"
                    :show-upload-list="false"
                    :on-success="handleSuccess"
                    :format="['jpg','jpeg','png','gif','bmp']"
                    :max-size="maxSize"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    :before-upload="handleBeforeUpload"
                    multiple
                    type="drag"
                    style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="ios-camera" size="20"></Icon>
                </div>
            </Upload>
            <Modal title="图片查看" v-model="visible">
                <img :src="imgUrl" v-if="visible" style="width: 100%">
            </Modal>
        </div>
    </div>
</template>
<script>
    import { uploadFile } from "@/api/sys";
    export default {
        name:'upload-file',
        props:{
            maxSize:{
                type: Number,
                default: 2048
            },
            defaultList:{
                type:Array,
            },
            fileNum:{
                type:Number,
                default:5
            },
            width:{
                type:Number,
                required: true
            },
            height:{
                type:Number,
                required: true
            }

        },
        data () {
            return {
                uploadFileUrl: uploadFile,
                imgUrl: '',
                visible: false,
                loading:false,
                flag:true,
                uploadList: [],
                accessToken: {},
                fileList:[],
                num:0,
            }
        },
        methods: {
            init() {
                this.accessToken = {
                    accessToken: this.getStore("accessToken")
                };
            },
            handleView (url) {
                this.imgUrl = url;
                this.visible = true;
            },
            handleRemove (index) {
                this.uploadList.splice(index, 1)
                this.fileList.splice(index, 1)
                this.defaultList.splice(index, 1)
                this.$emit("on-change", this.uploadList);
            },
            handleSuccess (res) {
               if(res.success){
                   this.defaultList.push({"url":res.result});
               }else{
                   this.$Message.error(res.message);
               }
               if(this.num==this.fileList.length){
                   this.$emit("on-change", this.uploadList);
               }
            },
            upload(){
                this.loading=true;
                for (let i = 0; i < this.fileList.length; i++) {
                    let item = this.fileList[i]
                    this.$refs.upload.post(item);
                    this.uploadList.splice(this.uploadList.indexOf(item),1)
                }
                this.$Message.success('上传成功');
                this.loading=false;
            },
            handleFormatError (file) {
                this.$Notice.error({
                    title: "不支持的文件格式",
                    desc:
                        "所选文件‘ " +
                        file.name +
                        " ’格式不正确, 请选择 .jpg .jpeg .png .gif .bmp格式文件"
                });
            },
            handleMaxSize (file) {
                this.$Message.error('文件' + file.name + '太大，请上传2M之内的文件.');
            },
            handleBeforeUpload (file) {
                const check = this.uploadList.length < this.fileNum;
                if (!check) {
                    this.$Message.error('您传的太多了,最多上传'+this.fileNum+'张图片...');
                    return false;
                }
                let reader = new FileReader()
                reader.readAsDataURL(file)
                const _this = this
                reader.onloadend = function (e) {
                    let data = e.target.result;
                    //加载图片获取图片真实宽度和高度
                    let image = new Image();
                     image.src= data;
                     let width = image.width;
                     let height = image.height;
                     if(_this.width!=width&&_this.height!=height){
                         _this.$Message.error('请上传'+_this.width+'px * '+_this.height+'px 的图片..');
                         return false;
                     }
                     file.url = reader.result
                    _this.uploadList.push(file);
                    _this.fileList.push(file);
                    _this.num++;
                }
                return false;
            }
        },
        watch: {
            '$route' () {
                this.uploadList = this.defaultList;
            }
        },
        created() {
            this.init();
            this.uploadList = this.defaultList;
        },
    }
</script>
<style>
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
