/** @jsx createElement */
import {createElement, Component} from 'weex-rx';
import { View, Text,Image,TouchableHighlight,ScrollView} from 'nuke';
import app from './app.rxscss';
import {mount} from 'nuke-mounter';
import {Button,Input,Icon,ListView,NumberPicker} from 'nuke';



class ButtonDemo extends Component {
    constructor() {
        super();
        
    
    }
    press(){
        
    }
    render(){
        var self=this;
        return (
            <View>
                <View style={app.showTitle}><Text style={app.showTitleText}>Number Picker</Text></View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>normal</Text></View>
                <View style={app.btnGroup}>
                    <NumberPicker min={1} max={100} defaultValue={2} onChange={this.changeHandle} step={1}/>
                </View>
                
                
            </View>
        )
    }
}


mount(<ButtonDemo />, 'body');