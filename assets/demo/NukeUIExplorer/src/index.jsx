/** @jsx createElement */
import {createElement, Component} from 'weex-rx';
import { View, Text,Image,TouchableHighlight} from 'nuke';
import app from './app.rxscss';
import {mount} from 'nuke-mounter';
import {Button,Input,Icon,ListView,Navigator} from 'nuke';

let listHeader = <View style={app.listHeader}><Text style={app.listHeaderText}>Nuke UI</Text><Text style={app.listHeaderSub}>优秀的rx组件库</Text></View>;
let listLoading = <View style={app.loading}>加载中...</View>;
let listRefresh = <View style={app.refresh}>下拉刷新</View>;
let listData = [
    {link:'button',text:'Button',desc:'按钮'},
    {link:'input',text:'Input',desc: '输入框'},
    {link:'text',text:'Text',desc: '文本'},
    {link:'scrollview',text:'Scrollview',desc: '滚动视图'},
    {link:'switch',text:'Switch',desc: '开关'},
    {link:'grid',text:'Grid',desc: '布局'},
    {link:'navigator',text:'Navigator and Link',desc: '导航与链接'},
    // {link:'link',text:'link',desc:' 链接'},
    {link:'listview',text:'List',desc:'长列表'},
    {link:'tabbar',text:'Tabbar',desc:'底部Tab'},
    {link:'tabbarmix',text:'Tabbar Mix',desc:'复杂的Tabbar混用'},
    {link:'tabtop',text:'Tab',desc:'顶部 Tab'},
    {link:'scrollabletab',text:'scrollabletab',desc:'顶部可滚动Tab'},

    {link:'slider',text:'Slider',desc:'轮播图'},
    {link:'modal',text:'Modal',desc:'对话框'},
    {link:'feedback',text:'Feedback',desc:'操作反馈'},
    {link:'radio',text:'Radio',desc:'单选按钮'},
    {link:'numberpicker',text:'Number Picker',desc:'数量选择器'},
    // {link:'nativetabbar',text:'native tabbar',desc:'xxx'},
    {link:'tabbarembed',text:'tabbar embed',desc:'xxx'},
    {link:'tabbarmixembed',text:'tabbar mix embed',desc:'xxx'},
    {link:'dialog',text:'Dialog',desc:'浮层'},
    {link:'view',text:'View',desc:'自定义样式和内容'},
    {link:'picker',text:'Picker',desc:'选择器'},
    {link:'image',text:'Image',desc:'图片'},
    {link:'textinput',text:'TextInput',desc:'基础输入框'}
];



class NukeUI extends Component {
    constructor() {
        super();
        this.state = {
            data: listData,
            stop: false
        };
        this.index = 0;
    
    }
    
    linkTo(item,e) {

        Navigator.push('qap://'+item.link+'.js',item.text);
    }
    renderItem (item, index){
        return <TouchableHighlight style={app.cellItemIndex} onPress={this.linkTo.bind(this,item)}>
                <View style={app.cellTextView}>
                    <Text style={app.itemMainTitle}>{item.text}</Text>
                    <Text style={app.itemSubTitle}>{item.desc}</Text>
                </View>
                <Icon style={app.itemArrow} src="//img.alicdn.com/tfs/TB1EU2rMVXXXXcpXXXXXXXXXXXX-64-64.png" />
            </TouchableHighlight>;
  
    }
    separate(item, index) {
        if  (index % 4 == 3) {
            return <View style={app.separator}></View>;
      
        }
      
    }
    onloading(){

    }
    onrefresh(){

    }
    render(){
        var self=this;
        return (
            <ListView 
                header={listHeader}
                fixHeader={false}
                loadMoreOffset="500"
                style={app.listContainer}
                refresh={listRefresh}
                onloading={self.onloading.bind(self)}
                onrefresh={self.onrefresh.bind(self)}
                renderRow={self.renderItem.bind(self)} 
                data={self.state.data}
                stop={self.state.stop}
            
            />
        )
    }
}


mount(<NukeUI />, 'body');