<template>
    <div style="margin-left: 10px;">
        <baidu-map v-bind:style="mapStyle" class="bm-view" ak="RX0p5IoAF2uQ2IGChalUB8UdDHg3F8af" :center="location" :zoom="zoom" :scroll-wheel-zoom="true"
                   @click="getClickInfo" @moving="syncCenterAndZoom" @moveend="syncCenterAndZoom">
            <bm-view style="width: 100%; height:500px;"></bm-view>
            <bm-marker :position="{lng: location.lng, lat: location.lat}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE"/>
            <bm-control :offset="{width: '10px', height: '10px'}">
                <bm-auto-complete v-model="keyword" :sugStyle="{zIndex: 999999}">
                    <input type="text" placeholder="请输入搜索关键字" class="ivu-input ivu-input-default">
                </bm-auto-complete>
            </bm-control>
            <bm-local-search :keyword="keyword"  :auto-viewport="true" style="width:0px;height:0px;overflow: hidden;"></bm-local-search>
        </baidu-map>
    </div>
</template>

<script>
    import {BaiduMap, BmControl, BmView, BmAutoComplete, BmLocalSearch, BmMarker} from 'vue-baidu-map'
    export default {
        components: {
            BaiduMap,
            BmControl,
            BmView,
            BmAutoComplete,
            BmLocalSearch,
            BmMarker
        },
        props:{
            location:{
                type:Object,
                default(){
                   return {lng: 108.953827, lat: 34.267115}
                },
            },
        },
        data: function () {
            return {
                showMapComponent: this.value,
                keyword: '',
                mapStyle: {
                    width: '100%',
                    height: this.mapHeight + 'px'
                },
                zoom: 15
            }
        },
        watch: {
            value: function (currentValue) {
                this.showMapComponent = currentValue
                if (currentValue) {
                    this.keyword = ''
                }
            }
        },
        methods: {
            /***
             * 地图点击事件。
             */
            getClickInfo (e) {
                this.location.lng = e.point.lng
                this.location.lat = e.point.lat
                this.$emit('on-change',this.location)
            },
            syncCenterAndZoom (e) {
                const {lng, lat} = e.target.getCenter()
                this.location.lng = lng
                this.location.lat = lat
                this.$emit('on-change',this.location)
                this.zoom = e.target.getZoom()
            }
        }
    }
</script>

<style scoped>
</style>
