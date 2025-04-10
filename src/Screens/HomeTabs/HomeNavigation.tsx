export type HomeRouteParamList = {
    HomeScreen: undefined;
    NotificationScreen: undefined;
    PublicPlaylistScreen: {isScreenFrom: string }
    PopularTrendingScreen: {Header_Name:string,
      Video_Id: string,
      Type: string,}
      ArtistScreen: {Header_Name:string,
      Video_Id: string,
      Type: string,}
      ArtistDetailsScreen: {Header_Name:string,
      Video_Id: string,
      Type: string,}
      GenreScreen: {Header_Name:string,
      Video_Id: string,
      Type: string,}
  };