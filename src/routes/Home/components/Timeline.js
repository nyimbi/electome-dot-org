import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'

let clusters = require('../clusters.json')
let scene = null
let renderer = null
let camera = null
let gui = null

const yMin = 0
const yMax = 50

const params = {
	cameraX: 108,
	cameraY: 102,
	cameraZ: 176,
	cameraLAX: 138,
	cameraLAY: -48,
	cameraLAZ: 14,
	cameraLeft: -178,
	cameraRight: 400,
	cameraTop: 62,
	cameraBottom: -156,
	cameraNear: 1,
	cameraFar: 10000
}

export const Timeline = React.createClass({
	getInitialState() {
		return {}
	},

	drawDebugGrid() {
		const size = 50
		const step = 5

		const geometry = new THREE.Geometry()
		const material = new THREE.LineBasicMaterial({ color: "white" })

		for (let i = - size; i <= size; i+= step) {
			geometry.vertices.push(new THREE.Vector3(-size, -0.04, i))
			geometry.vertices.push(new THREE.Vector3(size, -0.04, i))

			geometry.vertices.push(new THREE.Vector3(i, -0.04, -size))
			geometry.vertices.push(new THREE.Vector3(i, -0.04, size))
		}

		const line = new THREE.Line(geometry, material, THREE.LinePieces)
		// scene.add(line)

		const axisHelper = new THREE.AxisHelper(50)
		scene.add(axisHelper)
	},

	drawCurve(points, index) {
		const subdivisions = 20

		points = points.map((d, i) =>
			new THREE.Vector3(20 * index, Math.round(d), (10 * index) + (i * 10)))

		const spline = new THREE.Spline(points)
		const geometrySpline = new THREE.Geometry()

		for(let i=0; i<points.length * subdivisions; i++) {
			let index = i / (points.length * subdivisions)
			let position = spline.getPoint(index)

			geometrySpline.vertices[ i ] = new THREE.Vector3( position.x, position.y, position.z )
		}

		geometrySpline.computeLineDistances()

		const object = new THREE.Line( geometrySpline, new THREE.LineBasicMaterial({ color: 0xffffff }))

		scene.add(object)
	},

	configureDATGUI() {
		gui.add(params, "cameraX").min(-200).max(200).step(2).onFinishChange(this.renderViz)
		gui.add(params, "cameraY").min(0).max(200).step(2).onFinishChange(this.renderViz)
		gui.add(params, "cameraZ").min(0).max(200).step(2).onFinishChange(this.renderViz)
		gui.add(params, "cameraLAX").min(-200).max(200).step(2).onFinishChange(this.renderViz)
		gui.add(params, "cameraLAY").min(-200).max(200).step(2).onFinishChange(this.renderViz)
		gui.add(params, "cameraLAZ").min(-200).max(400).step(2).onFinishChange(this.renderViz)
		gui.add(params, "cameraLeft").min(-1000).max(1000).step(2).onFinishChange(this.renderViz)
		gui.add(params, "cameraRight").min(-1000).max(1000).step(2).onFinishChange(this.renderViz)
		gui.add(params, "cameraTop").min(-1000).max(1000).step(2).onFinishChange(this.renderViz)
		gui.add(params, "cameraBottom").min(-1000).max(1000).step(2).onFinishChange(this.renderViz)
		gui.add(params, "cameraNear").min(-1000).max(1000).step(2).onFinishChange(this.renderViz)
		gui.add(params, "cameraFar").min(0).max(10000).step(2).onFinishChange(this.renderViz)
	},

	initViz() {
		const node = ReactDOM.findDOMNode(this)
		const WIDTH = window.innerWidth
		const HEIGHT = node.offsetHeight

		const ASPECT = WIDTH / HEIGHT
		const NEAR = 1
		const FAR = 10000

		renderer = new THREE.WebGLRenderer()
		camera = new THREE.OrthographicCamera(params.cameraLeft, params.cameraRight, params.cameraTop, params.cameraBottom, params.cameraNear, params.cameraFar)

		scene = new THREE.Scene()

		scene.add(camera)

		renderer.setSize(WIDTH, HEIGHT)

		node.appendChild(renderer.domElement)
	},

	renderViz() {
		this.drawDebugGrid()

		camera.left = params.cameraLeft
		camera.right = params.cameraRight
		camera.top = params.cameraTop
		camera.bottom = params.cameraBottom
		camera.near = params.cameraNear
		camera.far = params.cameraFar

		camera.updateProjectionMatrix()

		camera.position.set(params.cameraX, params.cameraY, params.cameraZ)

		camera.lookAt(new THREE.Vector3(params.cameraLAX, params.cameraLAY, params.cameraLAZ))

		clusters.map(d => d.sparkline).forEach(this.drawCurve)

		renderer.render(scene, camera)
	},

	componentDidMount() {
		gui = new dat.GUI({
			height: 300
		})

		clusters = clusters.map(d => {
			const startMoment = moment(d.start_time)
			const endMoment = moment(d.end_time)
			const range = Math.abs(startMoment.diff(endMoment, 'days'))
			let current = yMin + Math.random() * (yMax - yMin) / 2
			const peakIndex = 1 + Math.round(Math.random() * (range - 2))

			d.sparkline = []
			for(let i=0; i<range; i++) {
				d.sparkline.push(current)
				if(i < peakIndex) {
					current = Math.min(yMax, current + Math.random() * Math.max(0, yMax - current) / (peakIndex - i))
				} else {
					current = Math.max(yMin, current - Math.random() * Math.max(0, current - yMin) / Math.max(1, i - peakIndex))
				}
			}

			return d
		})

		setTimeout(() => {
			this.initViz()
			this.renderViz()
			this.configureDATGUI()
		}, 100)
	},

	render() {
		return (
			<div className="timeline"></div>
		)
	}
})

export default Timeline