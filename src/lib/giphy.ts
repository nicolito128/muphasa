import * as superagent from 'superagent'

interface ApiOptions {
	search: string;
	rating?: RatingType;
}

type RatingType = 'g' | 'pg' | 'pg-13' | 'r'

interface GiphyResponse {
	data: GifObject;
	meta: MetaObject;
}

interface GifObject {
	type: string;
	id: string;
	slug: string;
	url: string;
	bitly_url: string;
	username: string;
	source: string;
	rating: string;
	content_url: string;
	user: any;
	source_tld: string;
	source_post_url: string;
	update_datetime: string;
	create_datetime: string;
	import_datetime: string;
	trending_datetime: string;
	images: ImageObject;
	title: string;
	image_url: string;
}

interface ImageObject {
	url: string;
	width: string;
	height: string;
	size: string;
	mp4: string;
	mp4_size: string;
	webp: string;
	webp_size: string;
}

interface PaginationObject {
	offset: number;
	total_count: number;
	count: number;
}

interface MetaObject {
	status: number;
	msg: string;
	response_id: string;
}

export default class GiphySearcher {
	private readonly apiKey = process.env.GIPHY_API_KEY || ""
	private readonly apiURL: string = 'api.giphy.com/v1/gifs/random'
	readonly options: ApiOptions

	constructor(options: ApiOptions) {
		if (!options.rating) options.rating = 'g'
			this.options = options
	}

	async getResponse(): Promise<GiphyResponse | undefined> {
		try {
			const { body } = await superagent.get(this.apiURL).query({
				tag: this.parseSearch(this.options.search),
				'api_key': this.apiKey,
				rating: this.options.rating
			})

			return body
		} catch(err) {
			console.log(err)
		}
	}

	private parseSearch(str: string): string {
		return str.toLowerCase().replace(/[\s+]/g, '+')
	}
}