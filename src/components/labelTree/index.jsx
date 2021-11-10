import React, { useState, useEffect,Component } from 'react';
import {Tree} from 'antd';
import {getLabelTree} from '../../pages/label/service'
export default class LabelTree extends Component{
    state={
        treeList:[]
    }
    constructor(props) {
        //const { handSelect} = props;
        super(props);
    }
    componentWillReceiveProps(nextProps){
    }
    getTreeList=async()=>{
        var res=await getLabelTree({id:this.props.theId});
        if(res?.status==0){
            this.setState({treeList:res.data.arr});
        }
    }
    onSelect = (selectedKeys, info) => {
        this.props.handSelect(selectedKeys,info.selectedNodes)
    };
    
    onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys,info.selectedNodes);
    };
    componentDidMount() {
        this.getTreeList()
    }
    render(){
        const {choiceKeys,isEdit}=this.props;
        return(
            <>
                <Tree
                    multiple={true}
                    defaultSelectedKeys={choiceKeys}
                    defaultCheckedKeys={choiceKeys}
                    onSelect={this.onSelect}
                    onCheck={this.onCheck}
                    treeData={this.state.treeList}
                />
            </>
        )
    }
}