// @format

import React, { useReducer, useMemo, useState } from 'react'

import './style.css'

const App = () => {
	const [size, setSize] = useState(5)

	const [board, dispatchBoard] = useReducer(
		(board, action) => {
			switch (action.type) {
				case 'toggle':
					return board.map((row, y) =>
						row.map((space, x) =>
							(Math.abs(action.space[0] - x) <= 1 && action.space[1] === y) ||
							(Math.abs(action.space[1] - y) <= 1 && action.space[0] === x)
								? !space
								: space,
						),
					)

				case 'reset':
					return new Array(action.size).fill(new Array(action.size).fill(true))

				default:
					throw new Error(`Unknown action type: ${action.type}`)
			}
		},
		size,
		(size) => new Array(size).fill(new Array(size).fill(true)),
	)

	const won = useMemo(
		() => board.every((row) => row.every((space) => !space)),
		[board],
	)

	return (
		<div
			style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
		>
			<div
				className="width"
				style={{ display: 'flex', flexDirection: 'column' }}
			>
				<h1>Lights Out</h1>

				<svg
					xmlns="https://www.w3.org/2000/svg"
					style={{
						marginTop: 16,
						border: `solid 16px ${won ? 'green' : 'grey'}`,
						borderRadius: 32,
						padding: 8,
					}}
					viewBox={`0 0 ${10 * board[0].length} ${10 * board.length}`}
				>
					{board.map((row, y) =>
						row.map((space, x) => (
							<rect
								key={x}
								style={{
									transition: 'fill .3s',
									cursor: won || 'pointer',
								}}
								x={10 * x + 1}
								y={10 * y + 1}
								width={8}
								height={8}
								rx={1}
								fill={space ? '#3333FF' : '#000099'}
								onClick={(ev) => {
									ev.preventDefault()
									if (won) {
										return
									}

									dispatchBoard({ type: 'toggle', space: [x, y] })
								}}
							/>
						)),
					)}
				</svg>

				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginTop: 16,
						padding: '0 32px',
					}}
				>
					<input
						style={{
							fontSize: 20,
						}}
						type="number"
						min="2"
						value={size}
						onChange={(ev) => {
							let val = ev.target.value
							if (val.match(/^[0-9]*$/) == null) {
								return
							}

							setSize(parseInt(val, 10))
						}}
					/>

					<button
						style={{
							backgroundColor: 'cyan',
							borderRadius: 8,
							fontSize: 20,
							padding: 8,
							marginLeft: 8,
						}}
						disabled={!(size > 0)}
						onClick={() => {
							if (
								size !== board.length &&
								size > 20 &&
								!window.confirm(
									`Large board sizes can run pretty badly and be basically unplayable.\nAre you sure that you want to use a ${size}x${size} board?`,
								)
							) {
								return
							}

							dispatchBoard({ type: 'reset', size })
						}}
					>
						{size !== board.length ? 'Resize' : 'Reset'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default App
