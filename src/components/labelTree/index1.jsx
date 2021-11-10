import React, { useState, useEffect,Component } from 'react';
import {Tree} from 'antd';
import {getLabelTree} from '../../pages/label/service'
const LabelTree = (props) => {
    const { handSelect, choiceKeys} = props;
    const [treeList, setTreeList] = useState([]);
    const [selectKeys,setSelectKeys]= useState([]);
    const [checkKeys,setCheckKeys]= useState([]);
   
    const getTreeList=async()=>{
        var res=await getLabelTree({keyword:''});
        setTreeList(res.data.arr);
    }
    useEffect(() => {
        getTreeList()
    }, []);
    
    const onSelect = (selectedKeys, info) => {
        handSelect(selectedKeys,info)
    };
    
    const onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys,info);
    };
    
    return (<>
        <Tree
            multiple={true}
            //defaultExpandedKeys={}
            defaultSelectedKeys={props.choiceKeys}
            defaultCheckedKeys={props.choiceKeys}
            onSelect={onSelect}
            onCheck={onCheck}
            treeData={treeList}
        />
    </>)

};

export default LabelTree;
