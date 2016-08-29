import React from 'react'
import ReactDOM from 'react-dom'
const clusters = require('../clusters.json')
let scene = null
let renderer = null
let camera = null
const params = {}

export const Timeline = React.createClass({
	getInitialState() {
		return {}
	},

	drawDebugGrid() {
		const { size, step } = params

		const geometry = new THREE.Geometry()
		const material = new THREE.LineBasicMaterial({ color: "white" })

		for (let i = - size; i <= size; i+= step) {
			geometry.vertices.push(new THREE.Vector3(-size, -0.04, i))
			geometry.vertices.push(new THREE.Vector3(size, -0.04, i))

			geometry.vertices.push(new THREE.Vector3(i, -0.04, -size))
			geometry.vertices.push(new THREE.Vector3(i, -0.04, size))
		}

		const line = new THREE.Line(geometry, material, THREE.LinePieces)
		scene.add(line)

		const axisHelper = new THREE.AxisHelper(50)
		scene.add(axisHelper)
	},

	drawCurve() {
		const subdivisions = 20

		const points = [
			new THREE.Vector3(10, 10, 10),
			new THREE.Vector3(50, 100, 10),
			new THREE.Vector3(20, 30, 10)
		]

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

	renderDATGUI() {
		const gui = new dat.GUI({
			height: 300
		})

		gui.add(params, "size").onFinishChange(this.renderViz)

		gui.add(params, "step").onFinishChange(this.renderViz)
	},

	initViz() {
		const node = ReactDOM.findDOMNode(this)
		const WIDTH = window.innerWidth
		const HEIGHT = node.offsetHeight

		const VIEW_ANGLE = 30
		const ASPECT = WIDTH / HEIGHT
		const NEAR = 1
		const FAR = 200

		renderer = new THREE.WebGLRenderer()
		camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)

		scene = new THREE.Scene()

		scene.add(camera)

		camera.position.set(2, 20, 150)

		renderer.setSize(WIDTH, HEIGHT)

		node.appendChild(renderer.domElement)

		params.size = 50
		params.step = 5
	},

	renderViz() {
		this.drawDebugGrid()

		this.drawCurve()

		renderer.render(scene, camera)
	},

	componentDidMount() {
		setTimeout(() => {
			this.initViz()
			this.renderViz()
			this.renderDATGUI()
		}, 100)
	},

	render() {
		return (
			<div className="timeline"></div>
		)
	}
})

export default Timeline