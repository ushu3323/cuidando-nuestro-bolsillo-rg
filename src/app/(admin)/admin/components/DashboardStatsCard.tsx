import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";

export interface DashboardCounterCardProps {
  label: string;
  icon: React.JSX.Element;
  value: number;
}
export default function DashboardCounterCard({
  label,
  icon,
  value,
}: DashboardCounterCardProps) {
  return (
    <Card>
      <CardActionArea>
        <CardContent sx={{ display: "flex" }}>
          <Box
            flexGrow={1}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Typography
              variant="body2"
              color="text.secondary"
              textTransform="uppercase"
            >
              {label}
            </Typography>
            <Typography component="div" variant="h3">
              {value.toLocaleString()}
            </Typography>
          </Box>
          <Box p={2}>{icon}</Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
