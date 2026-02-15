import { useState } from "react";
import {
  Car,
  MapPin,
  Fuel,
  TrendingUp,
  Calculator,
  RotateCcw,
  Moon,
  Sun,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Button } from "./components/ui/button";
import { Switch } from "./components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./components/ui/card";

type TrafficCondition = "highway" | "light" | "moderate" | "heavy" | null;

const trafficPresets = {
  highway: {
    kmPerLiter: 18,
    label: "Highway",
    emoji: "🚗",
    color: "bg-blue-500",
  },
  light: {
    kmPerLiter: 15,
    label: "Light Traffic",
    emoji: "🟢",
    color: "bg-green-500",
  },
  moderate: {
    kmPerLiter: 13,
    label: "Moderate Traffic",
    emoji: "🟡",
    color: "bg-yellow-500",
  },
  heavy: {
    kmPerLiter: 10,
    label: "Heavy Traffic",
    emoji: "🔴",
    color: "bg-red-500",
  },
};

export default function App() {
  const [distance, setDistance] = useState<string>("");
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [gasPrice, setGasPrice] = useState<string>("");
  const [selectedTraffic, setSelectedTraffic] =
    useState<TrafficCondition>(null);
  const [customKmPerLiter, setCustomKmPerLiter] = useState<string>("");
  const [showResults, setShowResults] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Results
  const [results, setResults] = useState({
    totalDistance: 0,
    fuelConsumption: 0,
    fuelNeeded: 0,
    gasPrice: 0,
    totalCost: 0,
  });

  const calculateFuelCost = () => {
    const dist = parseFloat(distance);
    const price = parseFloat(gasPrice);

    if (!dist || !price || dist <= 0 || price <= 0) return;

    let fuelConsumption = 0;

    // Check if custom km/L is entered
    if (customKmPerLiter && parseFloat(customKmPerLiter) > 0) {
      fuelConsumption = parseFloat(customKmPerLiter);
    } else if (selectedTraffic) {
      fuelConsumption = trafficPresets[selectedTraffic].kmPerLiter;
    } else {
      return; // No fuel consumption selected
    }

    const totalDist = isRoundTrip ? dist * 2 : dist;
    const fuelNeeded = totalDist / fuelConsumption;
    const totalCost = fuelNeeded * price;

    setResults({
      totalDistance: totalDist,
      fuelConsumption,
      fuelNeeded,
      gasPrice: price,
      totalCost,
    });

    setShowResults(true);
  };

  const resetForm = () => {
    setDistance("");
    setIsRoundTrip(false);
    setGasPrice("");
    setSelectedTraffic(null);
    setCustomKmPerLiter("");
    setShowResults(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? "dark" : ""}`}
      style={{
        background: darkMode
          ? "linear-gradient(135deg, #2d3436 0%, #1e272e 100%)"
          : "linear-gradient(135deg, #95a5a6 0%, #bdc3c7 100%)",
      }}
    >
      <div className="max-w-md mx-auto px-4 py-6 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
              <Car
                className={
                  darkMode ? "h-8 w-8 text-white" : "h-8 w-8 text-[#2d3436]"
                }
              />
            </div>
            <div>
              <h1
                className={`text-xl ${darkMode ? "text-white" : "text-[#2d3436]"}`}
              >
                Trip Fuel Calculator
              </h1>
              <p
                className={`text-sm ${darkMode ? "text-gray-300" : "text-[#2d3436]/70"}`}
              >
                Philippines
              </p>
              <p
                className={`text-xs ${darkMode ? "text-gray-300" : "text-[#2d3436]/50"}`}
              >
                By Jandell Kilua Dadis
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-white" />
            ) : (
              <Moon className="h-5 w-5 text-[#2d3436]" />
            )}
          </Button>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showResults ? (
            /* Calculator Form */
            <motion.div
              key="form"
              className="flex-1 space-y-5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Distance Input */}
              <Card
                className={`${darkMode ? "bg-[#34495e]/90 border-[#4a6278]" : "bg-white/90 border-white/50"} backdrop-blur-sm`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <MapPin
                      className={`h-5 w-5 ${darkMode ? "text-[#95a5a6]" : "text-[#5f6c72]"}`}
                    />
                    <CardTitle
                      className={darkMode ? "text-white" : "text-[#2d3436]"}
                    >
                      Distance
                    </CardTitle>
                  </div>
                  <CardDescription
                    className={darkMode ? "text-gray-300" : "text-[#5f6c72]"}
                  >
                    How many kilometers will you travel?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label
                      htmlFor="distance"
                      className={darkMode ? "text-gray-200" : "text-[#2d3436]"}
                    >
                      Total distance (KM)
                    </Label>
                    <Input
                      id="distance"
                      type="number"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      placeholder="0"
                      className={`mt-1.5 ${darkMode ? "bg-[#2d3436] border-[#4a6278] text-white placeholder:text-gray-500" : "bg-white border-gray-300 text-[#2d3436]"}`}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#5f6c72]/10 to-[#95a5a6]/10">
                    <Label
                      htmlFor="round-trip"
                      className={darkMode ? "text-gray-200" : "text-[#2d3436]"}
                    >
                      Round Trip (2x distance)
                    </Label>
                    <Switch
                      id="round-trip"
                      checked={isRoundTrip}
                      onCheckedChange={setIsRoundTrip}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Gas Price Input */}
              <Card
                className={`${darkMode ? "bg-[#34495e]/90 border-[#4a6278]" : "bg-white/90 border-white/50"} backdrop-blur-sm`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Fuel
                      className={`h-5 w-5 ${darkMode ? "text-[#95a5a6]" : "text-[#5f6c72]"}`}
                    />
                    <CardTitle
                      className={darkMode ? "text-white" : "text-[#2d3436]"}
                    >
                      Gas Price
                    </CardTitle>
                  </div>
                  <CardDescription
                    className={darkMode ? "text-gray-300" : "text-[#5f6c72]"}
                  >
                    What is the current gas price per liter?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Label
                    htmlFor="gas-price"
                    className={darkMode ? "text-gray-200" : "text-[#2d3436]"}
                  >
                    Gas price (₱ per liter)
                  </Label>
                  <div className="relative mt-1.5">
                    <span
                      className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-[#5f6c72]"}`}
                    >
                      ₱
                    </span>
                    <Input
                      id="gas-price"
                      type="number"
                      step="0.01"
                      value={gasPrice}
                      onChange={(e) => setGasPrice(e.target.value)}
                      placeholder="65.50"
                      className={`pl-8 ${darkMode ? "bg-[#2d3436] border-[#4a6278] text-white placeholder:text-gray-500" : "bg-white border-gray-300 text-[#2d3436]"}`}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Traffic Condition */}
              <Card
                className={`${darkMode ? "bg-[#34495e]/90 border-[#4a6278]" : "bg-white/90 border-white/50"} backdrop-blur-sm`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp
                      className={`h-5 w-5 ${darkMode ? "text-[#95a5a6]" : "text-[#5f6c72]"}`}
                    />
                    <CardTitle
                      className={darkMode ? "text-white" : "text-[#2d3436]"}
                    >
                      Traffic Condition
                    </CardTitle>
                  </div>
                  <CardDescription
                    className={darkMode ? "text-gray-300" : "text-[#5f6c72]"}
                  >
                    Select your expected traffic condition
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(trafficPresets).map(([key, preset]) => (
                      <Button
                        key={key}
                        variant={
                          selectedTraffic === key ? "default" : "outline"
                        }
                        onClick={() => {
                          setSelectedTraffic(key as TrafficCondition);
                          setCustomKmPerLiter(""); // Clear custom when selecting preset
                        }}
                        className={`h-auto py-3 flex flex-col gap-1 ${
                          selectedTraffic === key
                            ? darkMode
                              ? "bg-[#5f6c72] border-[#5f6c72] text-white"
                              : "bg-[#737C7E] border-[#737C7E] text-white"
                            : darkMode
                              ? "bg-[#2d3436]/50 border-[#4a6278] text-gray-200 hover:bg-[#2d3436]"
                              : "bg-white border-gray-300 text-[#2d3436] hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-2xl">{preset.emoji}</span>
                        <span className="text-xs">{preset.label}</span>
                        <span className="text-xs opacity-70">
                          {preset.kmPerLiter} km/L
                        </span>
                      </Button>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-gray-300 dark:border-[#4a6278]">
                    <Label
                      htmlFor="custom-kml"
                      className={darkMode ? "text-gray-200" : "text-[#2d3436]"}
                    >
                      Custom fuel consumption (km/L)
                      <span className="text-xs opacity-70 ml-1">
                        (Optional)
                      </span>
                    </Label>
                    <Input
                      id="custom-kml"
                      type="number"
                      step="0.1"
                      value={customKmPerLiter}
                      onChange={(e) => {
                        setCustomKmPerLiter(e.target.value);
                        if (e.target.value) setSelectedTraffic(null);
                      }}
                      placeholder="14.2"
                      className={`mt-1.5 ${darkMode ? "bg-[#2d3436] border-[#4a6278] text-white placeholder:text-gray-500" : "bg-white border-gray-300 text-[#2d3436]"}`}
                    />
                    <p
                      className={`text-xs mt-1.5 ${darkMode ? "text-gray-400" : "text-[#5f6c72]"}`}
                    >
                      Enter your actual dashboard average to override traffic
                      presets
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Calculate Button */}
              <Button
                onClick={calculateFuelCost}
                disabled={
                  !distance ||
                  !gasPrice ||
                  (!selectedTraffic && !customKmPerLiter)
                }
                className={`w-full h-14 text-lg ${
                  darkMode
                    ? "bg-[#5f6c72] hover:bg-[#4a5860] text-white"
                    : "bg-[#737C7E] hover:bg-[#5f6c72] text-white"
                }`}
              >
                <Calculator className="mr-2 h-5 w-5" />
                Calculate Fuel Cost
              </Button>
            </motion.div>
          ) : (
            /* Results Screen */
            <motion.div
              key="results"
              className="flex-1 space-y-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <Card
                  className={`${darkMode ? "bg-[#34495e]/90 border-[#4a6278]" : "bg-white/90 border-white/50"} backdrop-blur-sm`}
                >
                  <CardHeader>
                    <CardTitle
                      className={`text-center ${darkMode ? "text-white" : "text-[#2d3436]"}`}
                    >
                      Trip Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <motion.div
                      className="bg-gradient-to-br from-[#5f6c72] to-[#737C7E] text-white p-6 rounded-xl text-center"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: 0.2,
                        duration: 0.5,
                        type: "spring",
                        bounce: 0.4,
                      }}
                    >
                      <motion.p
                        className="text-sm opacity-90 mb-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 0.9, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                      >
                        Total Estimated Fuel Cost
                      </motion.p>
                      <motion.p
                        className="text-4xl"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: 0.5,
                          duration: 0.5,
                          type: "spring",
                          bounce: 0.5,
                        }}
                      >
                        ₱{results.totalCost.toFixed(2)}
                      </motion.p>
                    </motion.div>

                    <div className="space-y-3 pt-2">
                      <motion.div
                        className="flex justify-between p-3 rounded-lg bg-gradient-to-r from-[#5f6c72]/10 to-[#95a5a6]/10"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.3 }}
                      >
                        <span
                          className={
                            darkMode ? "text-gray-300" : "text-[#5f6c72]"
                          }
                        >
                          Total Distance:
                        </span>
                        <span
                          className={darkMode ? "text-white" : "text-[#2d3436]"}
                        >
                          {results.totalDistance} km
                        </span>
                      </motion.div>

                      <motion.div
                        className="flex justify-between p-3 rounded-lg bg-gradient-to-r from-[#5f6c72]/10 to-[#95a5a6]/10"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7, duration: 0.3 }}
                      >
                        <span
                          className={
                            darkMode ? "text-gray-300" : "text-[#5f6c72]"
                          }
                        >
                          Fuel Consumption Used:
                        </span>
                        <span
                          className={darkMode ? "text-white" : "text-[#2d3436]"}
                        >
                          {results.fuelConsumption} km/L
                        </span>
                      </motion.div>

                      <motion.div
                        className="flex justify-between p-3 rounded-lg bg-gradient-to-r from-[#5f6c72]/10 to-[#95a5a6]/10"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.3 }}
                      >
                        <span
                          className={
                            darkMode ? "text-gray-300" : "text-[#5f6c72]"
                          }
                        >
                          Estimated Fuel Needed:
                        </span>
                        <span
                          className={darkMode ? "text-white" : "text-[#2d3436]"}
                        >
                          {results.fuelNeeded.toFixed(2)} liters
                        </span>
                      </motion.div>

                      <motion.div
                        className="flex justify-between p-3 rounded-lg bg-gradient-to-r from-[#5f6c72]/10 to-[#95a5a6]/10"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9, duration: 0.3 }}
                      >
                        <span
                          className={
                            darkMode ? "text-gray-300" : "text-[#5f6c72]"
                          }
                        >
                          Gas Price:
                        </span>
                        <span
                          className={darkMode ? "text-white" : "text-[#2d3436]"}
                        >
                          ₱{results.gasPrice.toFixed(2)} per liter
                        </span>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.4 }}
              >
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className={`w-full h-14 text-lg ${
                    darkMode
                      ? "bg-[#2d3436]/50 border-[#4a6278] text-white hover:bg-[#2d3436]"
                      : "bg-white border-gray-300 text-[#2d3436] hover:bg-gray-50"
                  }`}
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Recalculate
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Disclaimer */}
        <div
          className={`mt-6 text-center text-xs ${darkMode ? "text-gray-400" : "text-[#2d3436]/60"} px-4`}
        >
          <p>
            Results are estimates. Actual fuel consumption may vary depending on
            driving style, vehicle condition, and real-time traffic.
          </p>
        </div>
      </div>
    </div>
  );
}
