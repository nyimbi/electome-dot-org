import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'

let clusters = require('../clusters.json')
let scene = null
let renderer = null
let camera = null
let gui = null
let previousPos = null
let minDate = null
let maxDate = null
let dayHeight = 0

const yMin = 0
const yMax = 50
const zMin = 0
const zMax = 1500

const params = {
	cameraX: 34,
	cameraY: 102,
	cameraZ: 176,
	cameraLAX: 138,
	cameraLAY: -48,
	cameraLAZ: 14,
	cameraLeft: -178,
	cameraRight: 400,
	cameraTop: 62,
	cameraBottom: -128,
	cameraNear: 1,
	cameraFar: 10000
}

export const Timeline = React.createClass({
	getInitialState() {
		return {
			dragging: false
		}
	},

	onMouseDown() {
		this.setState({ dragging: true })
	},

	onMouseUp() {
		this.setState({ dragging: false })
	},

	onMouseMove(e) {
		let diffX = null
		let diffY = null

		if(previousPos !== null) {
			diffX = e.clientX - previousPos.x
			diffY = e.clientY - previousPos.y

			if(this.state.dragging) {
				params.cameraX -= diffX
				params.cameraLAX -= diffX

				params.cameraZ -= diffY
				params.cameraLAZ -= diffY

				this.renderViz()				
			}
		}

		previousPos = { x: e.clientX, y: e.clientY }
	},

	drawDebugGrid() {
		const size = zMax
		const step = 10

		const geometry = new THREE.Geometry()
		const material = new THREE.LineBasicMaterial({ color: "#CFD8DC" })

		for (let i = - size; i <= size; i+= step) {
			geometry.vertices.push(new THREE.Vector3(-size, -0.1, i))
			geometry.vertices.push(new THREE.Vector3(size, -0.1, i))

			geometry.vertices.push(new THREE.Vector3(i, -0.1, -size))
			geometry.vertices.push(new THREE.Vector3(i, -0.1, size))
		}

		const line = new THREE.Line(geometry, material, THREE.LinePieces)
		scene.add(line)

		const axisHelper = new THREE.AxisHelper(50)
		scene.add(axisHelper)
	},

	addShape(shape, x, y, z) {
		const geometry = new THREE.ShapeGeometry(shape)
		const mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xff0000, side: THREE.DoubleSide }))
		mesh.rotation.set(0, Math.PI / 2, 0)
		mesh.position.set(x, y, z)
		scene.add(mesh)
	},

	createShape(data, index) {
		const dateOffset = moment(data.start_time).diff(minDate, 'days')
		const shape = new THREE.Shape()

		shape.moveTo(0, 0)

		data.sparkline.forEach((d, i) => {
			shape.lineTo(i * dayHeight, Math.round(d))

			if(i === data.sparkline.length - 1) {
				shape.lineTo(i * dayHeight, 0)
			}
		})

		shape.lineTo(0, 0)

		this.addShape(shape, 20 * index, 0, (dateOffset * dayHeight) + (data.sparkline.length - 1) * dayHeight)
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

		scene.background = new THREE.Color(0xECEFF1)

		scene.add(camera)

		const light = new THREE.DirectionalLight( 0xffffff )
		light.position.set(-1, 1, 0).normalize()

		scene.add(light)

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

		clusters.forEach(this.createShape)

		renderer.render(scene, camera)
	},

	componentDidMount() {
		gui = new dat.GUI({
			height: 300
		})

		clusters = clusters.sort((a, b) => {
			const aStartMoment = moment(a.start_time)
			const bStartMoment = moment(b.start_time)
			if(moment(aStartMoment.format('YYYY-MM-DD')).isBefore(moment(bStartMoment.format('YYYY-MM-DD')))) {
				return -1
			}
			if(moment(aStartMoment.format('YYYY-MM-DD')).isAfter(bStartMoment.format('YYYY-MM-DD'))) {
				return 1
			}
			if(moment(a.end_time).isBefore(b.end_time)) {
				return -1
			}
			return 1
		}).map(d => {
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

		clusters.forEach(d => {
			if(!minDate || moment(d.start_time).isBefore(minDate)) {
				minDate = moment(d.start_time)
			}
			if(!maxDate || moment(d.end_time).isAfter(maxDate)) {
				maxDate = moment(d.end_time)
			}
		})

		dayHeight = (zMax - zMin) / Math.abs(minDate.diff(maxDate, 'days'))

		setTimeout(() => {
			this.initViz()
			this.renderViz()
			this.configureDATGUI()
		}, 100)
	},

	render() {
		return (
			<div 
				onMouseMove={this.onMouseMove}
				onMouseDown={this.onMouseDown}
				onMouseUp={this.onMouseUp}
				className="timeline"></div>
		)
	}
})

export default Timeline