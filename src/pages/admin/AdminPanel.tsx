import FormatterDemo from "../../components/ui/charts/charts";
import LinerChart from "../../components/ui/charts/liner-chart";
import SliderChart from "../../components/ui/charts/slider-chart";

export const AdminPanel = () => {
  return (
    <div className="p-6">
      <div className="bg-white rounded-sm shadow my-3 p-4">
        {/* Chartlar grid bilan responsiv */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LinerChart />
          <FormatterDemo />
        </div>

        {/* Pastdagi chart */}
        <div className="mt-4">
          <SliderChart />
        </div>
      </div>
    </div>
  );
};
