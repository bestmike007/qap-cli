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

    _renderContent(color, pageText, num) {
        let style=[app.tabContent]

        return (
          <View style={style}>
            <Text style={app.tabText,{color: color}}>{pageText}</Text>
          </View>
        );
    }
    render() {
        return (
            <Tabbar navTop={true} navScrollable={true}>
                <Tabbar.Item
                    title="全部" style={app.tabNavItem} 
                    selected={this.state.selectedTab === 'blueTab'}
                    onPress={() => {
                        this.setState({
                          selectedTab: 'blueTab',
                        });
                    }}>
                    {this._renderContent('#414A8C', 'Blue Tab 大家好我是蓝色的区域')}
                </Tabbar.Item>
                <Tabbar.Item
                    title="已买到特别长怎么的了" style={app.tabNavItem} 
                    num={this.state.notifCount > 0 ? this.state.notifCount : undefined}
                    selected={this.state.selectedTab === 'redTab'}
                    onPress={() => {
                        this.setState({
                          selectedTab: 'redTab',
                          notifCount: this.state.notifCount + 1,
                        });
                    }}>
                    {this._renderContent('#783E33', 'Red Tab 大家好我是红色的区域', this.state.notifCount)}
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
                    {this._renderContent('#21551C', 'Green Tab 大家好我是绿色的', this.state.presses)}
                </Tabbar.Item>
                <Tabbar.Item
                    renderAsOriginal
                    title="Morefwefwfe" style={app.tabNavItem} 
                    selected={this.state.selectedTab === 'greenTab'}
                    onPress={() => {
                        this.setState({
                          selectedTab: 'greenTab',
                          presses: this.state.presses + 1
                        });
                    }}>
                    {this._renderContent('#21551C', 'Green Tab 大家好我是绿色的', this.state.presses)}
                </Tabbar.Item>
                <Tabbar.Item
                    renderAsOriginal
                    title="afwefwfe" style={app.tabNavItem} 
                    selected={this.state.selectedTab === 'greenTab'}
                    onPress={() => {
                        this.setState({
                          selectedTab: 'greenTab',
                          presses: this.state.presses + 1
                        });
                    }}>
                    {this._renderContent('#21551C', 'Green Tab 大家好我是绿色的', this.state.presses)}
                </Tabbar.Item>
            </Tabbar>
        );
    }
}


mount(<TabbarDemo />, 'body');