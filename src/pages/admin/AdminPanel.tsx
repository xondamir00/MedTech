
import FormatterDemo from "../../components/ui/charts/charts";
import LinerChart from "../../components/ui/charts/liner-chart";
import SliderChart from "../../components/ui/charts/slider-chart";

export const AdminPanel = () => {


  return (
    <div className="p-6">
      <div className="bg-white rounded-sm shadow my-3">
        <div className="flex items-center justify-between">
          <LinerChart />
          <FormatterDemo />
        </div>
        <SliderChart />
      </div>
    

     
    </div>
  );
};
