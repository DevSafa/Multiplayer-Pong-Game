import axios from "axios";


export type RoomData = {
  name: string,
  owner: string,
  _count :{
    users_room: number
  }
  
};

// type GetRoomsDataResponse = {
//   data: RoomData[];
// };

export async function getRoomsData(kind:string) {
  const url:string = (kind === "Public rooms" ?  "/room/public_room" : "/room/protected_room");
  try {
    // 👇️ const data: GetUsersResponse
    const { data, status } = await axios.get<RoomData[]>(
      process.env.REACT_APP_SERVER_IP + url,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    // console.log(JSON.stringify(data, null, 4));

    // 👇️ "response status is: 200"
    // console.log('response status is: ', status);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      return "An unexpected error occurred";
    }
  }
}