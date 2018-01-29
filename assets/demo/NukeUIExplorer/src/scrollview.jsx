/** @jsx createElement */
import {createElement, Component} from 'weex-rx';
import { View, Text,Image,TouchableHighlight} from 'nuke';
import app from './app.rxscss';
import {mount} from 'nuke-mounter';
import {Button,Input,Icon,ListView, ScrollView} from 'nuke';



class ScrollViewDemo extends Component {
    constructor() {
        super();
    }
    press(){
        
    }
    render(){
        var self=this;
        return (
            <ScrollView>
                <View style={app.showTitle}><Text style={app.showTitleText}>ScrollView</Text></View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>横向</Text></View>

                <ScrollView horizontal={true} showScrollbar={false} hz="ScrollView-nukeTabNav" style={{width:'750rem',height:'176rem',flexDirection:'row'}}>
                    <View style={app.tabItem}>第1个</View>
                    <View style={app.tabItem}>第222222222个</View>
                    <View style={app.tabItem}>第3个</View>
                    <View style={app.tabItem}>第4个</View>
                    <View style={app.tabItem}>第5个</View>
                    <View style={app.tabItem}>第6个</View>
                    <View style={app.tabItem}>第7个</View>
                    <View style={app.tabItem}>第8个</View>
                    <View style={app.tabItem}>第9个</View>
                    <View style={app.tabItem}>第10个</View>
                    <View style={app.tabItem}>第11个</View>
                    <View style={app.tabItem}>第12个</View>
                </ScrollView>
                
                
            </ScrollView>
        )
    }
}


mount(<ScrollViewDemo />, 'body');