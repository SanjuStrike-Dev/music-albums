import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import Header from "../Header";
import "./AlbumDetails.css";

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins} minute${mins !== 1 ? "s" : ""} ${secs} second${secs !== 1 ? "s" : ""}`;
};

const formatDurationForSongs = (seconds) => {
  const hrs = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const mins = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
};

const formatSize = (bytes) => `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
const formatSizeForSongs = (bytes) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

const formatDate = (dateString) => dayjs(dateString).format("DD MMM YYYY");

const AlbumDetails = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/collectionDetails/${id}`).then((response) => {
      setAlbum(response.data);
    });
  }, [id]);

  if (!album) return <p>Loading...</p>;

  return (
    <>
      <Header title={album.name} />
      <Box className="album-overview">
        <Typography variant="h5">{album.name}</Typography>
      </Box>

      <Box className="album-info">
        {[
          { label: "Artist", value: album.artist },
          { label: "Type", value: album.type },
          { label: "Song Count", value: album.songCount },
          { label: "Total Size", value: formatSize(album.totalSizeInBytes) },
          { label: "Total Duration", value: formatDuration(album.totalDurationInSeconds) },
          { label: "Released On", value: formatDate(album.releasedOn) },
        ].map((item, index) => (
          <Box key={index} className="album-info-item">
            <Typography className="album-info-label" style={{fontSize:"12px"}}>{item.label}</Typography>
            <Typography className="album-info-value" style={{fontSize:"14px"}}>{item.value}</Typography>
          </Box>
        ))}
      </Box>

      <div style={{marginRight:"50px"}}>
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="table-header">Song</TableCell>
              <TableCell className="table-header">Performers</TableCell>
              <TableCell className="table-header">Duration</TableCell>
              <TableCell className="table-header">Size</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {album.songs.map((song, index) => (
              <TableRow key={index}>
                <TableCell className="table-data">{song.title}</TableCell>
                <TableCell className="table-data">{song.performers.join(", ")}</TableCell>
                <TableCell className="table-data">{formatDurationForSongs(song.durationInSeconds)}</TableCell>
                <TableCell className="table-data">{formatSizeForSongs(song.sizeInBytes)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </div>
      <Link to="/" className="back-link">Back to List</Link>
    </>
  );
};

export default AlbumDetails;
