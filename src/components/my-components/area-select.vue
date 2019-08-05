<template>
    <div>
        <Row :gutter="gutterNum">
            <Col :span="span" v-if="show(1)">
                <Select
                        ref="prov"
                        v-model="cloneValue.proId"
                        @on-change="changePro"
                        :filterable="searchable"
                        :placeholder="phHandled(1)"
                        :size="size"
                        :not-found-text="ndsHandled(1)"
                        :disabled="disabled === undefined ? false : disHandled(1)"
                        style="width:100%">
                    <Option v-for="item in provList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </Col>
            <Col :span="span" v-if="show(2)">
                <Select
                        ref="city"
                        v-model="cloneValue.cityId"
                        @on-change="changeCity"
                        :filterable="searchable"
                        :placeholder="phHandled(2)"
                        :size="size"
                        :not-found-text="ndsHandled(2)"
                        :disabled="disabled === undefined ? false : disHandled(2)"
                        style="width:100%">
                    <Option v-for="item in cityList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </Col>
            <Col :span="span" v-if="show(3)">
                <Select
                        ref="coun"
                        v-model="cloneValue.countyId"
                        @on-change="changeCountry"
                        :filterable="searchable"
                        :placeholder="phHandled(3)"
                        :size="size"
                        :not-found-text="ndsHandled(3)"
                        :disabled="disabled === undefined ? false : disHandled(3)"
                        style="width:100%">
                    <Option v-for="item in counList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </Col>
        </Row>
        <slot></slot>
    </div>
</template>

<script>
    import {findAreaList,findAreaChildren} from '../../api/sys';
    import common from '../../libs/common'
    import util from '../../libs';
    const areaLinkageArr = util.levelArr;
    export default {
        name: 'alSelector',
        data () {
            return {
                currStr: '',
                provList: [],
                cityList: {},
                counList: {},
                isInit: true,
                defaultPlaceholder: ['请选择省', '请选择市', '请选择县区', '请选择乡镇街'],
                defaultnotFoundText: ['无匹配省', '无匹配市', '无匹配县区', '无匹配乡镇街'],
                cloneValue:{
                    proId:'',
                    cityId:'',
                    countyId:'',
                }
            };
        },
        props: {
            gutter: {
                type: [String, Number],
                default: 0
            },
            level: {
                type: [String, Number],
                default: 3
            },
            value: {
                type: [Object]
            },
            searchable: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: [Array, String],
                default () {
                    return this.defaultPlaceholder;
                }
            },
            size: {
                type: String,
                default: 'default'
            },
            notFoundText: {
                type: [String, Array],
                default () {
                    return this.defaultnotFoundText;
                }
            },
            disabled: {
                type: [Boolean],
                default: false
            }
        },
        computed: {
            gutterNum () {
                if (typeof this.gutter === 'number') {
                    return this.gutter;
                } else {
                    return parseInt(this.gutter);
                }
            },
            showLevel () {
                return parseInt(this.level);
            },
            span () {
                if (util.oneOf(this.showLevel, areaLinkageArr)) {
                    return 24 /this.showLevel;
                }
            }
        },
        methods: {
            init(){
                if (!common.isNull(this.value.proId)&&!common.isNull(this.value.cityId)&&!common.isNull(this.value.countyId)) {
                    this.cloneValue=this.value
                    this.findCityChildren();
                    this.findCountyChildren();
                }
            },
            initData(){
                findAreaList(util.levelArr[1]).then(res=>{
                    if(res.success){
                       this.provList=res.result;
                    }
                })
            },
            findCityChildren(){
              findAreaChildren(this.cloneValue.proId).then(res=>{
                  if(res.success){
                      this.cityList=res.result;
                  }
              })
            },
            findCountyChildren(){
                findAreaChildren(this.cloneValue.cityId).then(res=>{
                    if(res.success){
                        this.counList=res.result;
                    }
                })
            },
            show (level) {
                if (level <= this.showLevel) {
                    return true;
                } else {
                    return false;
                }
            },
            changePro () {
                this.cloneValue.cityId='';
                if(!common.isNull(this.cloneValue.proId)){
                    this.findCityChildren()
                }
            },
            changeCity () {
                this.cloneValue.countyId='';
                if(!common.isNull(this.cloneValue.cityId)){
                    this.findCountyChildren()
                }
            },
            changeCountry () {
                this.$emit("on-change", this.cloneValue);
            },
            phHandled (level) {
                if (typeof this.placeholder === 'string' && this.placeholder !== '') {
                    return this.placeholder;
                } else {
                    if (this.placeholder && this.placeholder[level]) {
                        return this.placeholder[level];
                    } else {
                        return this.defaultPlaceholder[level];
                    }
                }
            },
            ndsHandled (index) {
                if (typeof this.notFoundText === 'string' && this.notFoundText !== '') {
                    return this.notFoundText;
                } else {
                    if (!this.notFoundText) {
                        return this.defaultnotFoundText[index];
                    } else {
                        if (this.notFoundText[index]) {
                            return this.notFoundText[index];
                        } else {
                            return this.defaultnotFoundText[index];
                        }
                    }
                }
            },
            disHandled () {
                return this.disabled;
            }
        },
        mounted () {
            this.initData();
            this.init();
        }
    };
</script>
