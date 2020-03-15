CREATE TABLE "mirror" (
    "email" character(512) NOT NULL,
    "counter" integer DEFAULT '0' NOT NULL,
    CONSTRAINT "mirror_email" PRIMARY KEY ("email")
) WITH (oids = false);


