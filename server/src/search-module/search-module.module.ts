import {Module} from '@nestjs/common';
import {ElasticsearchModule} from '@nestjs/elasticsearch';

@Module({
  imports: [ElasticsearchModule.register({
    node: process.env.NODE_ENV === 'production' ? 'http://elasticsearch:9200' : 'http://localhost:9200',
  })],
  exports: [ElasticsearchModule]
})
export class SearchModule {
}
