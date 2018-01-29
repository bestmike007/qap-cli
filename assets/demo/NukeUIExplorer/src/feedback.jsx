/** @jsx createElement */
import {createElement, Component} from 'weex-rx';
import { View, Text,Image,TouchableHighlight,ScrollView} from 'nuke';
import app from './app.rxscss';
import {mount} from 'nuke-mounter';
import {Button,Input,Icon,ListView,Feedback} from 'nuke';



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
                <View style={app.showTitle}><Text style={app.showTitleText}>Feedback</Text></View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>success</Text></View>
                <View style={app.btnGroup}>
                    <Feedback type="success">
                        There is something right for the right there is something right
                    </Feedback>
                </View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>error</Text></View>
                <View style={app.btnGroup}>
                    <Feedback type="error">
                        There is something error for the error there is something error
                    </Feedback>
                </View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>warning</Text></View>
                <View style={app.btnGroup}>
                    <Feedback type="warning">
                        There is something warning for the warning there is something warning
                    </Feedback>
                </View>
                
                
            </ScrollView>
        )
    }
}


mount(<ButtonDemo />, 'body');