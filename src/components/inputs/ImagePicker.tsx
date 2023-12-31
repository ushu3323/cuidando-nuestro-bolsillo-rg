import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  styled,
} from "@mui/material";
import { useRef, useState, type ChangeEvent } from "react";

interface Props {
  id?: string;
  name?: string;
  accept?: string;
  error?: boolean;
  helpText?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageInput({
  id,
  name,
  accept,
  error = false,
  helpText,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>();

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
    onChange?.(e);
  };

  const handleRemoveImage = () => {
    inputRef.current!.files = null;
    setImageUrl(undefined);
  };

  return (
    <Box>
      <Card
        sx={{
          overflow: "hidden",
          minHeight: 250,
          maxHeight: 400,
          display: "flex",
          flexDirection: "column",
          borderStyle: "solid",
          borderWidth: error ? 2 : 0,
          borderColor: error ? "error.main" : "",
        }}
      >
        <CardActionArea
          component="label"
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          {imageUrl && (
            <CardMedia
              component="img"
              height="250"
              image={imageUrl}
              sx={{ objectFit: "contain" }}
            />
          )}
          <CardContent sx={{ width: "100%", p: 1 }}>
            {imageUrl ? (
              <Typography marginX={2} variant="body2">
                Presione la imagen para seleccionar otra
              </Typography>
            ) : (
              <Box
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography textAlign="center" variant="h6">
                  Seleccionar o tomar una foto
                </Typography>
              </Box>
            )}
          </CardContent>
          <VisuallyHiddenInput
            ref={inputRef}
            id={id}
            name={name}
            accept={accept}
            onChange={handleOnChange}
            type="file"
          />
        </CardActionArea>
        {imageUrl && (
          <CardActions>
            <Button size="medium" color="error" onClick={handleRemoveImage}>
              Quitar
            </Button>
          </CardActions>
        )}
      </Card>
      <Typography
        variant="body2"
        p={1}
        color={error ? "error.main" : undefined}
      >
        {helpText}
      </Typography>
    </Box>
  );
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  height: 1,
  width: 1,
});
