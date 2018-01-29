/** @jsx createElement */
import {createElement, Component} from 'weex-rx';
import { View, Text,Image,TouchableHighlight,ScrollView} from 'nuke';
import app from './app.rxscss';
import {mount} from 'nuke-mounter';
import {Button,Input,Icon,ListView,Grid, Col, MultiRow} from 'nuke';

// const {Grid, Col, MultiRow}=GridPack;
const gridRow=4;
let gridData=[];

for (var i = 1; i < 29; i++) {
	let s=i.toString();
	if(i<10){
		s='0'+i.toString();
	}
	gridData.push({'icon':'https://g.alicdn.com/DingTalkWeb/web/2.20.1/app/img/face/default/emotion_0'+s+'.png','name':'表情'+s,'num':''})
}

class GridDemo extends Component {
    constructor() {
        super();
        this.state={
            gridData:gridData
        }
    
    }
    press(){
        
    }
    renderGridCell(item, index){

    	return <View style={app.gridcell}><Icon size="large" src={item.icon}/><Text>{item.name}</Text></View>
    }
    newText(e){
        var self=this;
        setTimeout(function(){
            gridData[gridData.length-1].name='天气不错';
            gridData[gridData.length-1].num='9';
            self.setState({gridData:gridData});
        },1000)
        
    }
    renderGridCellCom(item,index){
        let self=this;
        return <TouchableHighlight>
                <View style={customStyle.gridcell} >
                    <Icon size="large" src={item.icon}/>
                    <Text style={customStyle.funTitle}>{item.name}</Text>
                    <Text style={customStyle.sub}>{index}</Text>
                    {self.renderMark(item,index)}
                </View>
            </TouchableHighlight>
    }
    renderMark(item,index) {
        
        return (item.num!==''?
                <View style={customStyle.tagOuter}>
                    <View style={customStyle.tag}>
                        <Text style={customStyle.tagText}>{index}</Text>
                    </View>
                </View>
                :null
        );
            
        
    }
    render(){
        var self=this;
        return (
            <ScrollView>
                <View style={app.showTitle}><Text style={app.showTitleText}>Grid</Text></View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>等宽3列布局</Text></View>
                <Grid style={app.gridWrap}>
				  <Col style={app.col1}><Text>col1</Text></Col>
				  <Col style={app.col2}><Text>col2</Text></Col>
				  <Col style={app.col3}><Text>col3</Text></Col>
				</Grid>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>自定义列宽度，第一列占整个容器的 1/4，第二列占整个容器的 3/4</Text></View>
                <View style={app.gridWrap}>
                    <Grid style={app.gridWrap}>
					  <Col style={app.col4}><Text>col1</Text></Col>
					  <Col style={app.col5}><Text>col2</Text></Col>
					</Grid>
                </View>
                <View style={app.sepNormal}><Text style={app.sepNormalText}>MultiRow 多列grid</Text></View>
                <MultiRow dataSource={this.state.gridData} rows={gridRow} renderRow={this.renderGridCellCom.bind(this)} />
                <View style={app.gridWrap}>
                    <Button type="primary" onPress={this.newText.bind(this)}>修改</Button>
                </View>
                
            </ScrollView>
        )
    }
}
const customStyle={
    gridcell:{
        height:'200rem',
        'justifyContent':'center',
        'alignItems':'center',
        'border':'1rem',
        'borderStyle':'solid',
        'borderColor':'#e8e8e8',
        'marginTop':'-1rem',
        'marginLeft':'-1rem'
    },
    funTitle:{

    },
    tagOuter:{
        width:'46rem',
        height:'46rem',
        borderRadius:'23rem',
        'borderWidth':'2rem',
        'borderStyle':'solid',
        'borderColor':'#ffffff',
        position:'absolute',
        right:'40rem',
        top:'40rem',
        'backgroundColor':'#ff0000'
    },
    tag:{
        
        'flex':1,
        justifyContent:'center',
        alignItems:'center'
    },
    tagInner:{

    },
    tagText:{
        color:'#ffffff'
    },
    sub:{
        color:'#999'
    }
}

mount(<GridDemo />, 'body');