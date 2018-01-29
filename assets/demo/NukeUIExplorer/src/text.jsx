/** @jsx createElement */
import {createElement, Component} from 'weex-rx';
import { View, Text,Image,TouchableHighlight,ScrollView} from 'nuke';
import app from './app.rxscss';
import {mount} from 'nuke-mounter';
import {Button,Input,Icon,ListView} from 'nuke';



class TextDemo extends Component {
    constructor() {
        super();
        
    
    }
    press(){
        
    }
    render(){
        var self=this;
        return (
            <ScrollView>
                <View style={app.showTitle}><Text style={app.showTitleText}>Text</Text></View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>所有文字必须由text包裹</Text></View>
                <View style={app.viewGroup}>
                    <Text>Nuke UI</Text>
                </View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>可设置字号、颜色</Text></View>
                <View style={app.viewGroup}>
                    <Text style={app.textSize}>Nuke UI </Text>
                    <Text style={app.textColor}>Nuke UI </Text>
                </View>
               
                
            </ScrollView>
        )
    }
}


mount(<TextDemo />, 'body');