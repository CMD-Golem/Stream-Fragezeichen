export default async (request, context) => {
	return context.json({
		geo: context,
		header: request.headers.get("x-nf-geo"),
	});
};