import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import HotelIcon from "@mui/icons-material/Hotel";
import RouteIcon from "@mui/icons-material/Route";
function Itinerary({ days }) {
    if (days.length === 0) {
        return (<Alert severity="info" icon={<RouteIcon />}>
        Day-wise itinerary details are not available for this package yet.
      </Alert>);
    }
    return (<section className="space-y-5">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-cyan-700">
          Day-by-day plan
        </p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Itinerary</h2>
      </div>

      <div className="space-y-4">
        {days.map((day) => (<Card key={day.id} className="overflow-hidden border border-slate-100 shadow-sm" sx={{ borderRadius: 4 }}>
            <div className="grid gap-0 md:grid-cols-[8rem_1fr]">
              <div className="flex items-center justify-center bg-cyan-600 px-6 py-5 text-white md:flex-col">
                <span className="text-sm font-bold uppercase tracking-wide">
                  Day
                </span>
                <span className="ml-2 text-3xl font-black md:ml-0">
                  {day.dayNumber}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-black text-slate-950">{day.title}</h3>
                {day.description ? (<p className="mt-3 text-sm leading-7 text-slate-600">
                    {day.description}
                  </p>) : null}

                <div className="mt-5 flex flex-wrap gap-2">
                  {day.meals ? (<Chip icon={<RestaurantIcon />} label={day.meals} sx={{ borderRadius: 3, fontWeight: 700 }}/>) : null}
                  {day.accommodation ? (<Chip icon={<HotelIcon />} label={day.accommodation} sx={{ borderRadius: 3, fontWeight: 700 }}/>) : null}
                </div>
              </div>
            </div>
          </Card>))}
      </div>
    </section>);
}
export default Itinerary;
