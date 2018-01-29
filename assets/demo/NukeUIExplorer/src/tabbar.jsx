/** @jsx createElement */
import {createElement, Component} from 'weex-rx';
import { View, Text,Image,TouchableHighlight} from 'nuke';
import app from './app.rxscss';
import {mount} from 'nuke-mounter';
import {Button,Icon,ListView,Tabbar} from 'nuke';
import GridMod from './mods/grid';
class TabbarDemo extends Component {
    constructor() {
        super();
        this.state =  {
            selectedTab: 'tab1',
            notifCount: 0,
            presses: 0,
        };
    
    }
    componentWillReceiveProps(nextProps) {
        
    }

    shouldComponentUpdate() {
        console.log('111111');
    }

    _renderContent(color, pageText, num) {
        return (
          <View style={[app.tabContent, {backgroundColor: color}]}>
            <Text style={app.tabText}>{pageText}</Text>
          </View>
        );
    }
    _renderFirst() {
        return (
            <GridMod style={{flex:1}} />
        );
    }
    render() {
        var self=this;
        return (
            <Tabbar iconBar={true}>
                <Tabbar.Item
                    title="tab1"
                    icon={{src: '//img.alicdn.com/tfs/TB1cCLYMVXXXXXHXpXXXXXXXXXX-64-64.png',selected:'//img.alicdn.com/tfs/TB1MzYIMVXXXXXYXVXXXXXXXXXX-64-64.png'}}
                    selected={this.state.selectedTab === 'tab1'}
                    onPress={() => {
                    this.setState({
                      selectedTab: 'tab1',
                    });
                  }}>
                  {self._renderFirst()}
                </Tabbar.Item>
                <Tabbar.Item
                  title="tab2"
                  icon={{src: '//img.alicdn.com/tfs/TB1aoTvMVXXXXaKaXXXXXXXXXXX-64-64.png',selected:'//img.alicdn.com/tfs/TB1AZ_yMVXXXXX8aXXXXXXXXXXX-64-64.png'}}
                  badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
                  selected={this.state.selectedTab === 'tab2'}
                  onPress={() => {
                    this.setState({
                      selectedTab: 'tab2',
                      notifCount: this.state.notifCount + 1,
                    });
                  }}>
                  {this._renderContent('#783E33', 'Red Tab 大家好我是红色的区域', this.state.notifCount)}
                </Tabbar.Item>
                <Tabbar.Item
                  renderAsOriginal
                  title="tab3"
                  icon={{src: '//img.alicdn.com/tfs/TB1UsjYMVXXXXXaXpXXXXXXXXXX-64-64.png',selected:'//img.alicdn.com/tfs/TB12mLPMVXXXXa5XFXXXXXXXXXX-64-64.png'}}
                  selected={this.state.selectedTab === 'tab3'}
                  onPress={() => {
                    this.setState({
                      selectedTab: 'tab3',
                      presses: this.state.presses + 1
                    });
                  }}>
                  {this._renderContent('#21551C', 'Green Tab 大家好我是绿色的', this.state.presses)}
                </Tabbar.Item>
                <Tabbar.Item
                  renderAsOriginal
                  title="tab4"
                  icon={{src: '//img.alicdn.com/tfs/TB1.rPuMVXXXXc1aXXXXXXXXXXX-64-64.png',selected:'//img.alicdn.com/tfs/TB1qW2uMVXXXXcUaXXXXXXXXXXX-64-64.png'}}
                  selected={this.state.selectedTab === 'tab4'}
                  onPress={() => {
                    this.setState({
                      selectedTab: 'tab4',
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