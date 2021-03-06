
import DataLoader from "./data/DataLoader";
import TemplateManager from "./template/TemplateManager";

(async() =>
{
	try
	{
		const data = await DataLoader.loadTree();
		const svgPath = TemplateManager.write(data);
		console.log(svgPath);
	}
	catch (e)
	{
		console.log(e);
	}
})();
