export default async (request, context) => {
	return context.json({
		geo: context.geo.country.name,
		header: request.headers.get("x-nf-geo"),
	});
};