
import DataLoader from "./data/DataLoader";
import TemplateManager from "./template/TemplateManager";

try
{
	const data = DataLoader.loadTree();
	const svgPath = TemplateManager.write(data);
	console.log(svgPath);
}
catch (e)
{
	console.log(e);
}
