#!/usr/bin/env node
import { run } from './cli';

run().catch((err: Error) => {
  console.error(err.message);
  process.exit(1);
});
