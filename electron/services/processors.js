async function runUpstreamProcessors(record) {
    // Future:
    // - fetch URL content
    // - extract text from PDF/DOCX
    // - classify document
    // - generate embeddings
    return record;
  }
  
  async function runDownstreamProcessors(record) {
    // Future:
    // - save to SQLite/Postgres
    // - sync to cloud
    // - send to local AI pipeline
    // - trigger notification
    return record;
  }
  
  module.exports = {
    runUpstreamProcessors,
    runDownstreamProcessors
  };