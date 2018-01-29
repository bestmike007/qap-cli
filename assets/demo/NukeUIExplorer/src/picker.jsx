/** @jsx createElement */
import {createElement, Component} from 'weex-rx';
import { View, Text,Image,TouchableHighlight,ScrollView} from 'nuke';
import app from './app.rxscss';
import {mount} from 'nuke-mounter';
import {Button,Input,Icon,ListView} from 'nuke';
import {Dimensions, env} from 'nuke-core';
const isWeex = env.isWeex;



class PickerDemo extends Component {
    constructor() {
        super();
        
    
    }
    press(){
        if(isWeex){
            let picker = require('@weex-module/picker');
            picker.showListPicker({
                dataSource:[{key:'111',value:'大家好'},{key:'222',value:'aaa'}],
                title:'选一下'
            },function(e){
                console.log(e)
            },function(e){

            })
        }{


        }
    }
    render(){
        var self=this;
        return (
            <ScrollView>
                <View style={app.showTitle}><Text style={app.showTitleText}>Picker</Text></View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>normal</Text></View>
                <View style={app.btnGroup}>
                    <Button style={app.btnItem} onPress={this.press.bind(this)} type="primary">点我</Button>
                    <Button style={app.btnItem} onPress={this.press.bind(this)} type="secondary">secondary</Button>
                </View>
                
                
            </ScrollView>
        )
    }
}


mount(<PickerDemo />, 'body');