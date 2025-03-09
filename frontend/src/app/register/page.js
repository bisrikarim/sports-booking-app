"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  MenuItem,
  Container,
  Typography,
  Box,
  Alert,
  Paper,
  InputAdornment,
  Avatar,
  IconButton
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  AdminPanelSettings as AdminIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  SportsSoccer as SoccerIcon,
  SportsTennis as TennisIcon,
  SportsBasketball as BasketballIcon,
  SportsVolleyball as VolleyballIcon,
  PersonAdd as PersonAddIcon
} from "@mui/icons-material";

export default function AddUserPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Valeur par défaut : user
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'ajout de l'utilisateur");
      }

      setSuccess("Utilisateur ajouté avec succès !");
      setTimeout(() => router.push("/login"), 2000); // Redirection vers /login après 2s
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          mb: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: "100%",
            borderRadius: 2,
            background: 'linear-gradient(to bottom, #ffffff, #f5f8fa)'
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Avatar
              sx={{
                backgroundColor: "#1976d2",
                width: 70,
                height: 70,
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }}
            >
              <PersonAddIcon sx={{ fontSize: 40 }} />
            </Avatar>
          </Box>

          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#1976d2",
              mb: 1
            }}
          >
            MatchBook
          </Typography>

          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{
              fontWeight: "medium",
              color: "#333",
              mb: 3
            }}
          >
            Ajouter un utilisateur
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2
              }}
            >
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3,
                borderRadius: 2
              }}
            >
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              label="Nom"
              fullWidth
              margin="normal"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="Mot de passe"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            
            <TextField
              select
              label="Rôle"
              fullWidth
              margin="normal"
              variant="outlined"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AdminIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            >
              <MenuItem value="user">Utilisateur</MenuItem>
              <MenuItem value="admin">Administrateur</MenuItem>
            </TextField>
            
            <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              mb: 2,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: 2,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)'
            }}
          >
            Ajouter l&apos;utilisateur
          </Button>

            
            <Button
              variant="outlined"
              fullWidth
              onClick={() => router.push("/login")}
              sx={{
                mt: 1,
                py: 1.5,
                borderRadius: 2,
                color: "#1976d2",
                borderColor: "#1976d2",
                "&:hover": {
                  borderColor: "#1565c0",
                  backgroundColor: "rgba(25, 118, 210, 0.04)"
                }
              }}
            >
              Retour à la connexion
            </Button>
          </Box>

          <Box sx={{
            display: "flex",
            justifyContent: "center",
            mt: 5,
            gap: 2,
            color: "#9e9e9e"
          }}>
            <SoccerIcon />
            <BasketballIcon />
            <TennisIcon />
            <VolleyballIcon />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}