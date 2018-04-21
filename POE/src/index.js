import './index.scss';

import {
    passiveSkillTreeData,
    // ascClasses,
} from './st_tw'

console.log(passiveSkillTreeData)

const assets = passiveSkillTreeData['assets']
const nodes = passiveSkillTreeData['nodes']
const skillSprites = passiveSkillTreeData['skillSprites']
const imageRoot = passiveSkillTreeData['imageRoot']

/** 
 * nodes
 */
Object.keys(nodes).forEach(key => {
    const node = document.createElement('img')
    node.src = `${imageRoot}${nodes[key].icon}`
    document.getElementById('root').appendChild(node)
})

/**
 * skillSprites
 */
// Object.keys(skillSprites).forEach(key => {
//     Object.keys(skillSprites[key]).forEach(value => {
//         const node = document.createElement('img')
//         const br = document.createElement('br')
//         const key = Object.keys(skillSprites[key][value]['coords'])
//         console.log(key)
//     })
// })

/**
 * assets
 */
Object.keys(assets).forEach(key => {
    Object.keys(assets[key]).forEach(value => {
        const node = document.createElement('img')
        const br = document.createElement('br')
        node.src = assets[key][value]
        document.getElementById('root').appendChild(node)
        document.getElementById('root').appendChild(br)
    })
})