/** @jsx createElement */
import {createElement, Component} from 'weex-rx';
import { View, Text,Image,TouchableHighlight} from 'nuke';
import app from './app.rxscss';
import {mount} from 'nuke-mounter';
import {Button,Input,Icon,ListView,Tabbar} from 'nuke';


class TabbarDemo extends Component {
    constructor() {
        super();
        this.state =  {
            selectedTab: 'redTab',
            notifCount: 0,
            presses: 0,
        };
    
    }

    render() {
        return (
            <Tabbar navTop={true} navScrollable={false}>
                <Tabbar.Item
                    title="今日" style={app.tabNavItem} 
                    selected={this.state.selectedTab === 'blueTab'}
                    onPress={() => {
                        this.setState({
                          selectedTab: 'blueTab',
                        });
                    }}>
                </Tabbar.Item>
                <Tabbar.Item
                    title="昨日" style={app.tabNavItem} 
                    num={this.state.notifCount > 0 ? this.state.notifCount : undefined}
                    selected={this.state.selectedTab === 'redTab'}
                    onPress={() => {
                        this.setState({
                          selectedTab: 'redTab',
                          notifCount: this.state.notifCount + 1,
                        });
                    }}>
                </Tabbar.Item>
                <Tabbar.Item
                    renderAsOriginal
                    title="已卖出" style={app.tabNavItem} 
                    selected={this.state.selectedTab === 'greenTab'}
                    onPress={() => {
                        this.setState({
                          selectedTab: 'greenTab',
                          presses: this.state.presses + 1
                        });
                    }}>
                </Tabbar.Item>
            </Tabbar>
        );
    }
}


mount(<TabbarDemo />, 'body');