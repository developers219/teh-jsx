import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import PackageCard from "../components/packages/PackageCard";
import { getPackageCategories } from "../services/package-category.service";
import { getPackageSubcategories } from "../services/package-subcategory.service";
import api from "../services/api";
function Packages() {
    const [packages, setPackages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [categoryId, setCategoryId] = useState("");
    const [subcategoryId, setSubcategoryId] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        async function loadCategories() {
            try {
                setCategories(await getPackageCategories());
            }
            catch (error) {
                console.error(error);
            }
        }
        loadCategories();
    }, []);
    useEffect(() => {
        async function loadSubcategories() {
            if (!categoryId) {
                setSubcategories([]);
                setSubcategoryId("");
                return;
            }
            try {
                setSubcategories(await getPackageSubcategories(categoryId));
            }
            catch (error) {
                console.error(error);
            }
        }
        loadSubcategories();
    }, [categoryId]);
    useEffect(() => {
        async function fetchPackages() {
            try {
                setIsLoading(true);
                setErrorMessage("");
                const response = await api.get("/packages", {
                    params: {
                        categoryId: categoryId || undefined,
                        subcategoryId: subcategoryId || undefined,
                    },
                });
                setPackages(response.data.data);
            }
            catch (error) {
                setErrorMessage("We could not load travel packages right now. Please try again later.");
                console.error(error);
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchPackages();
    }, [categoryId, subcategoryId]);
    return (<main className="bg-slate-50">
      <section className="bg-slate-950 px-6 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
            Travel packages
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold sm:text-5xl">
            Explore curated packages for your next journey.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Compare expert-planned itineraries, destination highlights, and
            flexible travel options designed for real travelers.
          </p>
        </div>
      </section>

      <section className="px-6 py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 rounded-md bg-white p-4 shadow-sm md:grid-cols-3">
            <TextField select label="Category" value={categoryId} onChange={(event) => setCategoryId(event.target.value ? Number(event.target.value) : "")}>
              <MenuItem value="">All categories</MenuItem>
              {categories.map((category) => (<MenuItem key={category.id} value={category.id}>
                  {category.title}
                </MenuItem>))}
            </TextField>

            <TextField select label="Subcategory" value={subcategoryId} disabled={!categoryId} onChange={(event) => setSubcategoryId(event.target.value ? Number(event.target.value) : "")}>
              <MenuItem value="">All subcategories</MenuItem>
              {subcategories.map((subcategory) => (<MenuItem key={subcategory.id} value={subcategory.id}>
                  {subcategory.title}
                </MenuItem>))}
            </TextField>

            <div className="flex items-center">
              <button type="button" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50" onClick={() => {
            setCategoryId("");
            setSubcategoryId("");
        }}>
                Clear filters
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 pt-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {isLoading ? (<div className="rounded-md border border-slate-200 bg-white p-8 text-center text-slate-600">
              Loading packages...
            </div>) : null}

          {!isLoading && errorMessage ? (<Alert severity="error">{errorMessage}</Alert>) : null}

          {!isLoading && !errorMessage && packages.length === 0 ? (<div className="rounded-md border border-slate-200 bg-white p-8 text-center text-slate-600">
              No travel packages match the selected classification.
            </div>) : null}

          {!isLoading && !errorMessage && packages.length > 0 ? (<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {packages.map((travelPackage) => (<PackageCard key={travelPackage.id} travelPackage={travelPackage}/>))}
            </div>) : null}
        </div>
      </section>
    </main>);
}
export default Packages;
