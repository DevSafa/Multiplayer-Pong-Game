import { Stack, Typography } from '@mui/material'
import RoomButton from './RoomButton'
import reloadIcon from '../assets/reload-icon.png'
import { RoomData } from '../requests/home';
import { useEffect, useState } from 'react';

const data_rooms: Array<RoomData> = [
	{ name: 'Room Cmos 3.x', owner: 'bsana..', _count : {users_room: 84} },
	{ name: 'Gtx Cmos 3.x', owner: 'Testos..',  _count : {users_room: 47} },
];


function createRooms(rooms_info: Array<RoomData>): JSX.Element[] {
	const rooms = Array.from({ length: rooms_info.length }, (_, index) => {
		return (
			<li key={index} className="item">
				<RoomButton name={rooms_info[index].name}
					owner={rooms_info[index].owner}
					_count={rooms_info[index]._count} />
			</li>
		);
	});
	return rooms;
}

interface VisibilityProps {
	kind: string
}

const PublicRooms = ({ kind }: VisibilityProps) => {

	const [value, setValue] = useState(Array<RoomData>());

	useEffect(() => {
		// getRoomsData(kind).then((value) => {
		// 	const data = value as Array<RoomData>;
		// 	setValue(data);
		// })
	});

	return (
		<Stack
			spacing={2}
			sx={{width: '100%',}}>
			<Stack
				spacing={2}
				direction='row'>
				<Typography
					sx={{
						fontWeight: 'bold',
						fontSize: '2rem',
						lineHeight: ' 35.05px',
						align: 'center',
					}}>
					{kind}</Typography>
				<img alt='reload Icon' src={reloadIcon} style={{ width: 35 }} />
			</Stack>
			<div className="horizontal_slider">
				<div className="slider_container">
					{createRooms(data_rooms)}
				</div>
			</div>
		</Stack>
	)
}

export default PublicRooms