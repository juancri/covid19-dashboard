
import DataLoader from "./data/DataLoader";
import ImageGenerator from "./image/ImageGenerator";
import TemplateManager from "./template/TemplateManager";

try
{
	const data = DataLoader.loadTree();
	const svgPath = TemplateManager.write(data);
	const pngPath = ImageGenerator.generate(svgPath);
	console.log(pngPath);
}
catch (e)
{
	console.log(e);
}
