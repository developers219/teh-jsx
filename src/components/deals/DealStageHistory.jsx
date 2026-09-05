import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { getDealStageHistory } from "../../services/deal.service";
function formatDate(value) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}
function DealStageHistory({ dealId }) {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        async function loadHistory() {
            try {
                setIsLoading(true);
                setErrorMessage("");
                setHistory(await getDealStageHistory(dealId));
            }
            catch (error) {
                setErrorMessage("Deal stage history could not be loaded.");
                console.error(error);
            }
            finally {
                setIsLoading(false);
            }
        }
        loadHistory();
    }, [dealId]);
    if (isLoading) {
        return (<Paper sx={{
                borderRadius: 3,
                minHeight: 180,
                display: "grid",
                placeItems: "center",
            }}>
        <CircularProgress />
      </Paper>);
    }
    if (errorMessage) {
        return <Alert severity="error">{errorMessage}</Alert>;
    }
    return (<Paper sx={{ borderRadius: 3, p: 3 }}>
      <Typography className="text-lg font-black text-slate-950">
        Stage history
      </Typography>

      {history.length === 0 ? (<Typography className="mt-4 text-sm text-slate-600">
          No stage movements recorded yet.
        </Typography>) : (<div className="mt-5 space-y-4">
          {history.map((item) => (<div key={item.id} className="border-l-2 border-cyan-600 pl-4 last:pb-0">
              <div className="flex flex-wrap items-center gap-2">
                {item.fromStage ? (<>
                    <Chip label={item.fromStage.displayName} size="small"/>
                    <Typography className="text-xs text-slate-500">
                      →
                    </Typography>
                  </>) : null}
                <Chip label={item.toStage.displayName} color="primary" size="small"/>
              </div>

              <Typography className="mt-2 text-xs text-slate-500">
                {formatDate(item.createdAt)}
                {item.changedByName ? ` · ${item.changedByName}` : ""}
              </Typography>

              {item.notes ? (<Typography className="mt-1 text-sm text-slate-700">
                  {item.notes}
                </Typography>) : null}
            </div>))}
        </div>)}
    </Paper>);
}
export default DealStageHistory;
