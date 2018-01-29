/** @jsx createElement */
import {createElement, Component} from 'weex-rx';
import { View, Text,Image,TouchableHighlight} from 'nuke';
import app from './app.rxscss';
import {mount} from 'nuke-mounter';
import {Button,EmbedTab} from 'nuke';
const isWeex = typeof callNative !== 'undefined';
const isWeb = typeof window === 'object';

class EmbedTabDemo extends Component {
    constructor() {
        super();
        this.state =  {
            selectedBar: 't1',
            notifCount: 0,
            presses: 0,
            stop: false
        };
    
    }



    render() {

        let CustomHeight;
        // if(isWeex){
        //     CustomHeight={height:120 * 750/WXEnvironment.deviceWidth+'rem'};
        // }else{
            CustomHeight={height:'93rem'};
        // }
        return (
            <EmbedTab iconBar={true} style={[app.tabbar,CustomHeight]}>
                <EmbedTab.Item
                    title="首页"
                    selected={this.state.selectedBar === 't1'}
                    icon={{src: '//img.alicdn.com/tfs/TB1cCLYMVXXXXXHXpXXXXXXXXXX-64-64.png',size:'medium',selected:'//img.alicdn.com/tfs/TB1MzYIMVXXXXXYXVXXXXXXXXXX-64-64.png'}}
                    src="qap://input.js"
                    isWeex={true}
                    style={[app.tabbarItem,CustomHeight]}
                    onPress={() => {
                    this.setState({
                      selectedBar: 't1',
                    });
                  }}>
                </EmbedTab.Item>
                <EmbedTab.Item
                  title="天气不错"
                  icon={{src: '//img.alicdn.com/tfs/TB1aoTvMVXXXXaKaXXXXXXXXXXX-64-64.png',size:'medium',selected:'//img.alicdn.com/tfs/TB1AZ_yMVXXXXX8aXXXXXXXXXXX-64-64.png'}}
                  badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
                  selected={this.state.selectedBar === 't2'}
                  style={[app.tabbarItem,CustomHeight]}
                  src="qap://button.js"
                    isWeex={true}
                  onPress={() => {
                    this.setState({
                      selectedBar: 't2',
                      notifCount: this.state.notifCount + 1,
                    });
                  }}>
                </EmbedTab.Item>
                <EmbedTab.Item
                  title="活没干完"
                  src="qap://listview.js"
                  style={[app.tabbarItem,CustomHeight]}
                    isWeex={true}
                  icon={{src: '//img.alicdn.com/tfs/TB1UsjYMVXXXXXaXpXXXXXXXXXX-64-64.png',size:'medium',selected:'//img.alicdn.com/tfs/TB12mLPMVXXXXa5XFXXXXXXXXXX-64-64.png'}}
                  selected={this.state.selectedBar === 't3'}
                  onPress={() => {
                    this.setState({
                      selectedBar: 't3',
                      presses: this.state.presses + 1
                    });
                  }}>
                </EmbedTab.Item>
                 <EmbedTab.Item
                  title="怎么办呢"
                  src="qap://view.js"
                    isWeex={true}
                  icon={{src: '//img.alicdn.com/tfs/TB1.rPuMVXXXXc1aXXXXXXXXXXX-64-64.png',size:'medium',selected:'//img.alicdn.com/tfs/TB1qW2uMVXXXXcUaXXXXXXXXXXX-64-64.png'}}
                  selected={this.state.selectedBar === 't4'}
                  style={[app.tabbarItem,CustomHeight]}
                  onPress={() => {
                    this.setState({
                      selectedBar: 't4',
                      presses: this.state.presses + 1
                    });
                  }}>
                </EmbedTab.Item>
            </EmbedTab>
        );
    }
}


mount(<EmbedTabDemo />, 'body');