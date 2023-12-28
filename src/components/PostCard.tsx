import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { type Post } from "../data/posts";

export default function PostCard({ post }: { post: Post }) {
  return (
    <Card sx={{ height: 276 }}>
      <CardActionArea className="flex h-full flex-col items-start">
        <CardMedia
          component="img"
          height="140"
          image={post.image ?? "/placeholder.png"}
          placeholder=""
        />
        <CardContent className="flex grow flex-col">
          <Box flexGrow={1}>
            <Typography
              variant="body1"
              fontWeight={400}
              component="p"
              className="line-clamp-2"
            >
              {post.product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {post.commerce.name}
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary">
            {post.price.toNumber().toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
