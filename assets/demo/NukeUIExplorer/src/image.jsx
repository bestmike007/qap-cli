/** @jsx createElement */
import {createElement, Component} from 'weex-rx';
import { View, Text,Image,TouchableHighlight,ScrollView} from 'nuke';
import app from './app.rxscss';
import {mount} from 'nuke-mounter';
import {Button,Input,Icon,ListView} from 'nuke';



class ButtonDemo extends Component {
    constructor() {
        super();
        
    
    }
    press(){
        
    }
    render(){
        var self=this;
        return (
            <ScrollView>
                <View style={app.showTitle}><Text style={app.showTitleText}>Image</Text></View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>normal</Text></View>
                <View style={app.btnGroup}>
      
                    <Image source={{uri: 'https://gd2.alicdn.com/imgextra/i4/2343799809/TB218gMdVXXXXaTXXXXXXXXXXXX_!!2343799809.jpg_200x200.jpg'}}  style={{width:'120rem',height:'120rem',borderRadius:'60rem',marginLeft:'20rem'}} resizeMode='cover' />
                    
                </View>
                
                
            </ScrollView>
        )
    }
}


mount(<ButtonDemo />, 'body');