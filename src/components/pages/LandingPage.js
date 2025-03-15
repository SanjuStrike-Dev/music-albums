import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  InputAdornment,
} from "@mui/material";
import Header from "../Header";
import dayjs from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./LandingPage.css";

const formatDuration = (seconds) => {
  const hrs = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const mins = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
};

const formatSize = (bytes) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

const formatDate = (dateString) =>
  dayjs(dateString).format("DD MMM YYYY, hh:mm A");

const LandingPage = () => {
  const [collections, setCollections] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/collections").then((response) => {
      setCollections(response.data);
    });
  }, []);

  const handleTypeChange = (event, type) => {
    if (event.target.tagName === "INPUT") {
      setSelectedTypes((prev) =>
        prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
      );
    } else {
      setSelectedTypes([type]);
      setOpenDropdown(false);
    }
  };

  const filteredCollections = collections.filter(
    (collection) =>
      (selectedTypes.length === 0 || selectedTypes.includes(collection.type)) &&
      collection.name.toLowerCase().includes(search.toLowerCase())
  );

  const typeCounts = collections.reduce((acc, collection) => {
    acc[collection.type] = (acc[collection.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <Header />
      <div style={{ padding: 20 }}>

        <TableContainer
          component={Paper}
          sx={{
            marginTop: 2,
            backgroundColor: "#FFFFFF",
            fontFamily: "Commissioner, sans-serif",
          }}
        >
           <TextField
          variant="outlined"
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            height: "40px",
            "& input::placeholder": {
              textOverflow: "ellipsis !important",
              color: "#818E94",
              opacity: 1,
            },
            "& .MuiInputBase-root": {
              height: "40px !important",
              backgroundColor: "white",
              borderRadius: "8px",
              color: "#000000",
              fontSize: "14px",
              width: "300px",
              marginLeft: "15px",
              marginTop: "10px",
            },
          }}
        />

        <Select
          multiple
          open={openDropdown}
          onOpen={() => setOpenDropdown(true)}
          onClose={() => setOpenDropdown(false)}
          displayEmpty
          value={selectedTypes}
          renderValue={(selected) =>
            selected.length
              ? selected
                  .map((type) => `${type} (${typeCounts[type] || 0})`)
                  .join(", ")
              : "Type"
          }
          sx={{
            width: "110px",
            height: "40px",
            borderRadius: "8px",
            marginLeft: "5px",
            backgroundColor: "#E1E4E9",
            color: "#677A90",
            fontSize: "14px",
            margin: "10px",
          }}
        >
           {["Album", "EP", "Single"].map((type) => (
            <MenuItem
              key={type}
              value={type}
              onClick={(e) => handleTypeChange(e, type)}
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "8px",
                marginLeft: "-10px",
                padding: "2px 10px",
              }}
            >
              <Checkbox checked={selectedTypes.includes(type)} size="small" />
              <ListItemText primary={type} sx={{ fontSize: "12px" }} />
            </MenuItem>
          ))}
        </Select>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Collection Name",
                  "Type",
                  "Song Count",
                  "Duration",
                  "Size",
                  "Released On",
                  "",
                ].map((head) => (
                  <TableCell
                    key={head}
                    style={{
                      fontWeight: "bold",
                      color: "#29313A",
                      fontSize: "14px",
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCollections.map((collection) => (
                <TableRow key={collection.id}>
                  <TableCell>
                    <div className="collection-title">{collection.name}</div>
                    <div className="collection-artist">{collection.artist}</div>
                  </TableCell>
                  {[
                    collection.type,
                    collection.songCount,
                    formatDuration(collection.durationInSeconds),
                    formatSize(collection.sizeInBytes),
                    formatDate(collection.releasedOn),
                  ].map((item, index) => (
                    <TableCell key={index} className="table-data">
                      {item}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Link
                      to={`/collection/${collection.id}`}
                      className="view-details"
                    >
                      <VisibilityIcon fontSize="small" />
                      <span>View Details</span>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default LandingPage;
