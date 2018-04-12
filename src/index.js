import './index.scss';

import {
    passiveSkillTreeData,
    ascClasses,
} from './st_tw'

// console.log(passiveSkillTreeData)

const assets = passiveSkillTreeData['assets']

let imgArr = []

Object.keys(assets).forEach((key, index) => {
    Object.keys(assets[key]).forEach(value => {
        imgArr.push(assets[key][value])

        const node = document.createElement('img')
        const br = document.createElement('br')
        node.src = assets[key][value]
        document.getElementById('root').appendChild(node)
        document.getElementById('root').appendChild(br)
    })
})